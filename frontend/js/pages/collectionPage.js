import { getUserCards } from "../api/apiClient.js";

// ==========================================
// 1. HTML DE LA PAGE
// ==========================================
const collectionHtml = `
    <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-slide-in-down">
            <div>
                <h1 class="text-4xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2 filter drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                    MA COLLECTION
                </h1>
                <p class="text-gray-400 font-orbitron">Gérez vos personnages et consultez leurs détails.</p>
            </div>
            
            <div class="bg-slate-800/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/50 shadow-lg flex gap-6">
                <div class="text-center">
                    <p class="text-2xl font-orbitron font-bold text-white" id="stat-unique">0</p>
                    <p class="text-xs text-gray-400 uppercase tracking-wider">Uniques</p>
                </div>
                <div class="text-center border-l border-slate-700 pl-6">
                    <p class="text-2xl font-orbitron font-bold text-cyan-400" id="stat-total">0</p>
                    <p class="text-xs text-gray-400 uppercase tracking-wider">Total</p>
                </div>
                <div class="text-center border-l border-slate-700 pl-6">
                    <div class="flex items-center gap-2 justify-center">
                        <p class="text-2xl font-orbitron font-bold text-purple-400" id="stat-completion">0%</p>
                        <i data-lucide="pie-chart" class="w-5 h-5 text-purple-400"></i>
                    </div>
                    <div class="w-24 h-2 bg-slate-700 rounded-full mt-1 overflow-hidden">
                        <div id="completion-bar" class="h-full bg-gradient-to-r from-cyan-500 to-purple-500 w-0 transition-all duration-1000"></div>
                    </div>
                    <p class="text-xs text-gray-400 uppercase tracking-wider mt-1">Complétion</p>
                </div>
            </div>
        </div>

        <div class="bg-slate-800/50 backdrop-blur-md p-4 rounded-xl border border-slate-700/50 mb-8 flex flex-wrap gap-4 items-center animate-fade-in">
            <div class="flex items-center gap-2 text-gray-300 mr-4">
                <i data-lucide="filter" class="w-5 h-5"></i>
                <span class="font-orbitron font-bold">FILTRE</span>
            </div>

            <select id="filter-rarity" class="bg-slate-900 text-white border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none font-orbitron">
                <option value="all">Toutes raretés</option>
                <option value="COMMON">Common</option>
                <option value="RARE">Rare</option>
                <option value="EPIC">Epic</option>
                <option value="LEGENDARY">Legendary</option>
            </select>
        </div>

        <div id="collection-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-slide-up-fade">
        </div>
    </div>

    <div id="card-modal" class="hidden fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
        <div class="absolute inset-0 cursor-pointer z-0" onclick="window.closeCardModal()"></div>
        <div id="modal-card-wrapper" class="relative z-10 w-full max-w-sm perspective-1000"></div>
    </div>
`;

// Variables d'état globales
let myRawCards = [];
let displayedCards = [];
const TOTAL_CARDS_IN_GAME = 150;

// ==========================================
// 2. INITIALISATION ET FORMATAGE DES DONNÉES
// ==========================================
export async function initCollectionPage() {
  document.getElementById("app-content").innerHTML = collectionHtml;
  if (window.lucide) lucide.createIcons();

  const userStr = localStorage.getItem("user");
  if (!userStr) return;
  const user = JSON.parse(userStr);

  try {
    const backendCards = await getUserCards(user.id);

    console.log("🔍 Données brutes reçues du serveur :", backendCards);

    // S'adapte à tous les noms de variables possibles
    myRawCards = backendCards.map((uc) => {
      // Détecte automatiquement l'objet contenant les stats
      const tpl = uc.cardTemplate || uc.card || uc;

      return {
        id: tpl.id || uc.id,
        userCardId: uc.id,
        name: tpl.name || tpl.Name || "Inconnu",
        anime: tpl.anime || tpl.Anime || "Inconnu",
        rarity: tpl.rarity || tpl.Rarity || "COMMON",
        overall: tpl.overallRating || tpl.overall_rating || tpl.overall || 0,
        vitesse: tpl.vitesse || tpl.Vitesse || 0,
        force: tpl.force || tpl.Force || 0,
        dribble: tpl.dribble || tpl.Dribble || 0,
        defense: tpl.defense || tpl.Defense || 0,
        tir: tpl.tir || tpl.Tir || 0,
        passe: tpl.passe || tpl.Passe || 0,
        imageUrl: tpl.imageUrl || tpl.image_url || tpl.image || "",
        genres: tpl.genres || [],
        count: uc.quantity || uc.count || 1,
      };
    });

    displayedCards = myRawCards;

    updateCollectionDisplay();
    updateStats();
  } catch (error) {
    console.error("Erreur lors du chargement de la collection", error);
  }

  document
    .getElementById("filter-rarity")
    .addEventListener("change", updateCollectionDisplay);
}

// ==========================================
// 3. LOGIQUE DE FILTRAGE ET AFFICHAGE
// ==========================================
function updateCollectionDisplay() {
  const rarityFilter = document
    .getElementById("filter-rarity")
    .value.toUpperCase();
  let filtered = displayedCards;

  if (rarityFilter !== "ALL") {
    filtered = filtered.filter(
      (c) => c.rarity && c.rarity.toUpperCase() === rarityFilter,
    );
  }

  renderCollection(filtered);
}

function renderCollection(cards) {
  const container = document.getElementById("collection-grid");
  if (cards.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center py-20 text-gray-500 font-orbitron font-bold text-xl">Aucune carte ne correspond à ce filtre.</div>`;
    return;
  }

  container.innerHTML = cards
    .map((c, index) => {
      const rarity = (c.rarity || "COMMON").toLowerCase();
      const rarityColors = {
        legendary: {
          text: "text-yellow-400",
          border: "border-yellow-500/50",
          shadow: "shadow-yellow-500/20",
        },
        epic: {
          text: "text-purple-400",
          border: "border-purple-500/50",
          shadow: "shadow-purple-500/20",
        },
        rare: {
          text: "text-cyan-400",
          border: "border-cyan-500/50",
          shadow: "shadow-cyan-500/20",
        },
        common: {
          text: "text-gray-400",
          border: "border-gray-500/50",
          shadow: "shadow-gray-500/20",
        },
      };
      const colors = rarityColors[rarity] || rarityColors["common"];

      return `
        <div class="relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl ${colors.shadow} border ${colors.border} group animate-fade-in"
             style="animation-delay: ${index * 50}ms"
             onclick="window.openCardModal(${c.id})">
            
            <img src="${c.imageUrl}" alt="${c.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onerror="this.src='https://via.placeholder.com/300x450/1e293b/06b6d4?text=IMAGE+HS'">
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
            
            <div class="absolute bottom-0 left-0 right-0 p-3 transform translate-y-8 group-hover:translate-y-0 transition-transform">
                 <h3 class="font-orbitron text-lg font-black text-white truncate drop-shadow-lg">${c.name}</h3>
                 <div class="flex justify-between items-center mt-0.5 mb-2">
                    <p class="text-[10px] ${colors.text} font-bold uppercase tracking-widest">${c.rarity}</p>
                    <p class="font-orbitron text-sm font-bold text-white">OVR ${c.overall}</p>
                 </div>
                 
                 <div class="grid grid-cols-3 gap-1 text-[9px] bg-black/60 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    <div class="text-center"><span class="text-gray-400">PAC</span><br/><span class="font-bold text-white">${c.vitesse}</span></div>
                    <div class="text-center"><span class="text-gray-400">DRI</span><br/><span class="font-bold text-white">${c.dribble}</span></div>
                    <div class="text-center"><span class="text-gray-400">SHO</span><br/><span class="font-bold text-white">${c.tir}</span></div>
                    <div class="text-center"><span class="text-gray-400">DEF</span><br/><span class="font-bold text-white">${c.defense}</span></div>
                    <div class="text-center"><span class="text-gray-400">PAS</span><br/><span class="font-bold text-white">${c.passe}</span></div>
                    <div class="text-center"><span class="text-gray-400">PHY</span><br/><span class="font-bold text-white">${c.force}</span></div>
                 </div>
            </div>

            ${c.count > 1 ? `<div class="absolute top-3 right-3 bg-red-600 text-white font-orbitron font-bold text-xs px-2 py-1 rounded-full shadow-lg z-10">x${c.count}</div>` : ""}
        </div>
    `;
    })
    .join("");
}

function updateStats() {
  const uniqueCount = displayedCards.length;
  const totalCount = myRawCards.reduce((acc, card) => acc + card.count, 0);

  if (document.getElementById("stat-unique"))
    document.getElementById("stat-unique").innerText = uniqueCount;
  if (document.getElementById("stat-total"))
    document.getElementById("stat-total").innerText = totalCount;

  if (
    document.getElementById("stat-completion") &&
    document.getElementById("completion-bar")
  ) {
    const percentage = Math.round((uniqueCount / TOTAL_CARDS_IN_GAME) * 100);
    document.getElementById("stat-completion").innerText = `${percentage}%`;
    document.getElementById("completion-bar").style.width = `${percentage}%`;
  }
}

// ==========================================
// 4. FONCTIONS DE LA MODALE
// ==========================================
window.openCardModal = function (cardId) {
  const card = displayedCards.find((c) => c.id === cardId);
  if (!card) return;

  let genresHtml = "";
  if (card.genres && Array.isArray(card.genres)) {
    genresHtml = card.genres
      .map(
        (g) =>
          `<span class="bg-slate-700/50 border border-slate-600 text-gray-300 text-[10px] px-2 py-0.5 rounded-full">${g}</span>`,
      )
      .join("");
  }

  const modalHtml = `
        <div class="detailed-card-container w-full h-[450px] mx-auto md:mx-0 relative perspective-1000 cursor-pointer group" onclick="this.classList.toggle('flipped')">
            <div class="detailed-card-inner w-full h-full transition-transform duration-700 transform-style-3d relative shadow-2xl rounded-xl">
                
                <div class="detailed-card-front absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden bg-cover bg-center" style="background-image: url('${card.imageUrl}');">
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent">
                        <div class="absolute bottom-0 left-0 right-0 p-6">
                            <div class="flex justify-between items-end">
                                <div>
                                    <h3 class="font-orbitron text-3xl font-black text-white leading-none mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">${card.name}</h3>
                                    <p class="text-sm text-cyan-400 font-bold uppercase tracking-widest drop-shadow">OVR ${card.overall}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="absolute top-4 right-4 text-white/50 bg-black/30 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <i data-lucide="repeat" class="w-6 h-6"></i>
                    </div>
                </div>

                <div class="detailed-card-back absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden bg-slate-900/95 border-2 border-slate-700 p-6 flex flex-col rotate-y-180">
                    <h3 class="font-orbitron text-xl font-bold text-white mb-4 text-center border-b border-slate-700 pb-3 flex items-center justify-center gap-2">
                        <i data-lucide="info" class="w-5 h-5 text-cyan-400"></i> DÉTAILS
                    </h3>
                    
                    <div class="space-y-4 flex-grow">
                        <div>
                            <p class="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-widest">Univers</p>
                            <p class="font-orbitron text-sm font-bold text-white">${card.anime}</p>
                        </div>

                        <div>
                            <p class="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-widest flex items-center gap-1">
                                <i data-lucide="bar-chart-2" class="w-3 h-3"></i> Statistiques
                            </p>
                            <div class="grid grid-cols-3 gap-2 text-sm bg-slate-800 p-2 rounded-lg">
                                <div class="text-center"><span class="text-gray-400 text-[10px]">PAC</span><br/><span class="font-bold text-white">${card.vitesse}</span></div>
                                <div class="text-center"><span class="text-gray-400 text-[10px]">DRI</span><br/><span class="font-bold text-white">${card.dribble}</span></div>
                                <div class="text-center"><span class="text-gray-400 text-[10px]">SHO</span><br/><span class="font-bold text-white">${card.tir}</span></div>
                                <div class="text-center"><span class="text-gray-400 text-[10px]">DEF</span><br/><span class="font-bold text-white">${card.defense}</span></div>
                                <div class="text-center"><span class="text-gray-400 text-[10px]">PAS</span><br/><span class="font-bold text-white">${card.passe}</span></div>
                                <div class="text-center"><span class="text-gray-400 text-[10px]">PHY</span><br/><span class="font-bold text-white">${card.force}</span></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex flex-wrap gap-1 mt-2">
                                ${genresHtml}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.getElementById("modal-card-wrapper").innerHTML = modalHtml;
  document.getElementById("card-modal").classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
};

window.closeCardModal = function () {
  const modal = document.getElementById("card-modal");
  modal.classList.add("hidden");
};
