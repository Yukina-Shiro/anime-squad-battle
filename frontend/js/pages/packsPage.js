import { packApi } from "../api/packApi.js";

// ============================================================================
// PAGE PACKS - SYSTÈME D'OUVERTURE INTERACTIVE (GACHA)
// ============================================================================

const packHtml = `
    <div class="max-w-7xl mx-auto p-4 lg:p-8 relative h-[calc(100vh-5rem)] flex flex-col">
        
        <div class="bg-slate-900/85 backdrop-blur-xl rounded-2xl border border-cyan-500/50 p-6 mb-10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-10 relative text-center">
            <h1 class="font-orbitron text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg uppercase tracking-widest">
                PORTAIL D'INVOCATION
            </h1>
            <p class="text-gray-400 font-bold tracking-widest text-sm mt-2">CHOISISSEZ VOTRE DESTIN</p>
        </div>

        <div id="packs-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 flex-1 items-center px-4 z-0 relative">
            </div>

        <div id="pack-modal" class="hidden fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4">
            
            <button id="btn-close-modal" class="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors" onclick="window.closePackModal()">
                <i data-lucide="x" class="w-8 h-8 md:w-10 md:h-10"></i>
            </button>

            <div id="modal-dynamic-content" class="flex flex-col items-center justify-center w-full max-w-5xl">
                </div>

        </div>
    </div>
`;

// --- DONNÉES SYNCHRONISÉES AVEC LE BACKEND ---
const mockPacks = [
  {
    id: 1,
    name: "PACK DÉBUTANT",
    price: 1000,
    cssClass: "pack-common",
    colorClass: "text-slate-300",
    bgImage: "./assets/images/pack-deku.jpg",
    description: "Contient 5 cartes (Taux normaux)",
  },
  {
    id: 2,
    name: "PACK VÉTÉRAN",
    price: 3000,
    cssClass: "pack-rare",
    colorClass: "text-cyan-400",
    bgImage: "./assets/images/pack-zoro.jpg",
    description: "Contient 5 cartes (Taux rares)",
  },
  {
    id: 3,
    name: "PACK ÉLITE",
    price: 5000,
    cssClass: "pack-epic",
    colorClass: "text-purple-400",
    bgImage: "./assets/images/pack-gojo.jpg",
    description: "Contient 5 cartes (Taux épiques)",
  },
  {
    id: 4,
    name: "PACK DIVIN",
    price: 10000,
    cssClass: "pack-legendary",
    colorClass: "text-yellow-400",
    bgImage: "./assets/images/pack-goku.jpg",
    description: "Contient 5 cartes (Taux Boosté)",
  },
];

let selectedPack = null;
let currentDrawnCards = []; // Cartes tirées du serveur
let flippedCardsCount = 0; // Compteur de cartes retournées
let packClicksRemaining = 3; // Nombres de clics pour casser le pack

export async function initPacksPage() {
  document.getElementById("app-content").innerHTML = packHtml;
  if (window.lucide) lucide.createIcons();
  renderPacks(mockPacks);
}

function renderPacks(packsList) {
  const container = document.getElementById("packs-container");
  container.innerHTML = packsList
    .map(
      (pack) => `
        <div class="gacha-pack ${pack.cssClass} p-0" onclick="window.openPackModal(${pack.id})" 
             style="background-image: linear-gradient(to bottom, rgba(10,15,25,0.1) 40%, rgba(5,5,10,0.9) 100%), url('${pack.bgImage}'); background-size: cover; background-position: center;">
            <div class="shine-effect"></div>
            <div class="gacha-pack-content p-5">
                <div class="w-full flex justify-between items-start opacity-80">
                    <div class="w-3 h-3 border-t-2 border-l-2 border-current ${pack.colorClass}"></div>
                    <div class="w-3 h-3 border-t-2 border-r-2 border-current ${pack.colorClass}"></div>
                </div>
                <div class="text-center w-full mt-auto flex flex-col items-center gap-3">
                    <h3 class="font-orbitron text-2xl font-black text-white italic tracking-wider drop-shadow-[0_5px_5px_rgba(0,0,0,1)]">${pack.name}</h3>
                    <div class="bg-slate-900/95 border border-slate-600 px-4 py-1.5 rounded-full font-orbitron font-bold ${pack.colorClass} flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                        ${pack.price} <i data-lucide="coins" class="w-4 h-4"></i>
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
  if (window.lucide) lucide.createIcons();
}

// ==========================================
// ÉTAPE 1 : OUVRIR LA MODALE D'ACHAT
// ==========================================
window.openPackModal = function (packId) {
  selectedPack = mockPacks.find((p) => p.id === packId);
  if (!selectedPack) return;

  const content = `
        <div id="modal-pack-visual" class="w-40 md:w-52 anim-float mb-6 pointer-events-none">
            <div class="gacha-pack ${selectedPack.cssClass} p-0 shadow-[0_0_50px_rgba(0,0,0,0.8)]" 
                 style="background-image: linear-gradient(to bottom, rgba(10,15,25,0.1) 40%, rgba(5,5,10,0.9) 100%), url('${selectedPack.bgImage}'); background-size: cover; background-position: center;">
                <div class="shine-effect"></div>
                <div class="gacha-pack-content p-5">
                    <div class="w-full flex justify-between items-start opacity-80">
                        <div class="w-3 h-3 border-t-2 border-l-2 border-current ${selectedPack.colorClass}"></div>
                        <div class="w-3 h-3 border-t-2 border-r-2 border-current ${selectedPack.colorClass}"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-center max-w-lg w-full">
            <h2 class="font-orbitron text-2xl md:text-3xl font-black text-white italic mb-2 ${selectedPack.colorClass}">${selectedPack.name}</h2>
            <p class="text-gray-400 text-xs md:text-sm font-bold tracking-widest mb-6">${selectedPack.description}</p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <button onclick="window.closePackModal()" class="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl font-orbitron transition-all">ANNULER</button>
                <button onclick="window.confirmPurchase()" id="btn-confirm-pack" class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black rounded-xl font-orbitron text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105">
                    ${selectedPack.price} <i data-lucide="coins" class="w-5 h-5"></i> - INVOQUER
                </button>
            </div>
        </div>
    `;

  document.getElementById("modal-dynamic-content").innerHTML = content;
  document.getElementById("btn-close-modal").classList.remove("hidden");
  document.getElementById("pack-modal").classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
};

// ==========================================
// ÉTAPE 2 : CONFIRMER L'ACHAT ET LANCER L'API
// ==========================================
window.confirmPurchase = async function () {
  const btn = document.getElementById("btn-confirm-pack");
  btn.innerHTML = `<i data-lucide="loader-2" class="w-6 h-6 animate-spin"></i> ACHAT...`;
  btn.disabled = true;
  if (window.lucide) lucide.createIcons();

  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) throw new Error("Vous devez être connecté !");

    let user = JSON.parse(userStr);

    // Empêche la requête si le joueur n'a pas assez de monnaie
    if (user.coins < selectedPack.price) {
      throw new Error(
        "Fonds insuffisants ! Gagnez des matchs pour obtenir des pièces.",
      );
    }

    const packTypes = { 1: "COMMON", 2: "RARE", 3: "EPIC", 4: "LEGENDARY" };
    const typeEnum = packTypes[selectedPack.id];

    // Appel API
    const pulledCards = await packApi.openPack(user.id, typeEnum);

    // Mise à jour : Uniquement si l'API a répondu un succès
    user.coins -= selectedPack.price;
    localStorage.setItem("user", JSON.stringify(user));
    if (document.getElementById("nav-coins"))
      document.getElementById("nav-coins").innerText = user.coins;

    currentDrawnCards = pulledCards.map((uc) => {
      const tpl = uc.cardTemplate || uc.card || uc;
      return {
        id: tpl.id || uc.id,
        name: tpl.name || tpl.Name || "Inconnu",
        rarity: tpl.rarity || tpl.Rarity || "COMMON",
        overall: tpl.overallRating || tpl.overall || 0,
        imageUrl: tpl.imageUrl || tpl.image_url || tpl.image || "",
      };
    });

    startInteractiveOpening();
  } catch (error) {
    alert(error.message); // Affiche joliment l'erreur
    window.closePackModal();
  } finally {
    // Dans tous les cas, si ça rate, on réactive le bouton
    if (btn) {
      btn.innerHTML = `${selectedPack?.price || ""} <i data-lucide="coins" class="w-5 h-5"></i> - INVOQUER`;
      btn.disabled = false;
      if (window.lucide) lucide.createIcons();
    }
  }
};

// ==========================================
// ÉTAPE 3 : LE PACK INTERACTIF
// ==========================================
function startInteractiveOpening() {
  packClicksRemaining = 3;
  document.getElementById("btn-close-modal").classList.add("hidden");

  const content = `
        <div class="text-center mb-8">
            <h2 class="font-orbitron text-2xl font-bold text-white animate-pulse">CLIQUEZ SUR LE PACK POUR L'OUVRIR</h2>
        </div>
        <div id="interactive-pack" class="w-52 md:w-72 cursor-pointer transition-all duration-200" onclick="window.hitPack()">
            <div class="gacha-pack ${selectedPack.cssClass} p-0 shadow-[0_0_50px_rgba(0,0,0,0.8)] pointer-events-none" 
                 style="background-image: linear-gradient(to bottom, rgba(10,15,25,0.1) 40%, rgba(5,5,10,0.9) 100%), url('${selectedPack.bgImage}'); background-size: cover; background-position: center;">
                <div class="shine-effect"></div>
            </div>
        </div>
    `;
  document.getElementById("modal-dynamic-content").innerHTML = content;
}

window.hitPack = function () {
  if (packClicksRemaining <= 0) return;

  packClicksRemaining--;
  const packDiv = document.getElementById("interactive-pack");

  packDiv.classList.remove("anim-shake");
  void packDiv.offsetWidth;
  packDiv.classList.add("anim-shake");

  const damageClass = `damage-${3 - packClicksRemaining}`;
  packDiv.classList.add(damageClass);

  if (packClicksRemaining === 0) {
    setTimeout(() => triggerExplosion(), 300);
  }
};

// ==========================================
// ÉTAPE 4 : EXPLOSION ET REVEAL DES CARTES
// ==========================================
function triggerExplosion() {
  const container = document.getElementById("modal-dynamic-content");
  container.innerHTML += `<div class="explosion-flash"></div>`;

  setTimeout(() => {
    showCardsFaceDown();
  }, 400);
}

function showCardsFaceDown() {
  flippedCardsCount = 0;

  let cardsHtml = `<div class="flex flex-wrap justify-center items-center gap-4 mb-10 w-full relative z-10">`;

  // Affichage des VRAIES cartes tirées
  currentDrawnCards.forEach((card, index) => {
    cardsHtml += `
            <div class="gacha-card-container" onclick="window.flipCard(this)">
                <div class="gacha-card-inner">
                    <div class="gacha-card-back">
                        <i data-lucide="help-circle" class="w-12 h-12 text-cyan-500 opacity-80 animate-pulse"></i>
                    </div>
                    <div class="gacha-card-front bg-cover bg-center relative overflow-hidden" style="background-image: url('${card.imageUrl}');">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        <div class="absolute bottom-0 left-0 right-0 p-3 text-center">
                            <p class="text-[10px] text-${card.rarity.toLowerCase() === "legendary" ? "yellow" : card.rarity.toLowerCase() === "epic" ? "purple" : "cyan"}-400 font-orbitron uppercase mb-0.5">${card.rarity}</p>
                            <h4 class="font-orbitron font-bold text-white leading-tight">${card.name}</h4>
                            <div class="mt-1 font-orbitron text-xl font-black text-yellow-500">${card.overall}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  });
  cardsHtml += `</div>`;

  const content = `
        <div class="text-center w-full relative z-10">
            <h2 class="font-orbitron text-3xl font-bold text-white mb-8">RETOURNEZ VOS CARTES !</h2>
            ${cardsHtml}
            <button id="btn-claim-cards" disabled onclick="window.claimCards()" class="px-8 py-4 bg-gray-600 text-gray-400 font-black rounded-xl font-orbitron text-xl transition-all cursor-not-allowed">
                RÉCUPÉRER
            </button>
        </div>
    `;

  document.getElementById("modal-dynamic-content").innerHTML = content;
  if (window.lucide) lucide.createIcons();
}

// ==========================================
// ÉTAPE 5 : RETOURNER LES CARTES ET GAGNER
// ==========================================
window.flipCard = function (element) {
  if (element.classList.contains("flipped")) return;

  element.classList.add("flipped");
  flippedCardsCount++;

  if (flippedCardsCount === currentDrawnCards.length) {
    const btn = document.getElementById("btn-claim-cards");
    btn.disabled = false;
    btn.className =
      "px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 hover:scale-105 text-white font-black rounded-xl font-orbitron text-xl transition-all shadow-[0_0_30px_rgba(34,197,94,0.5)] cursor-pointer";
    btn.innerHTML = `<i data-lucide="download" class="inline w-6 h-6 mr-2"></i> RÉCUPÉRER TOUT`;
    if (window.lucide) lucide.createIcons();
  }
};

window.claimCards = function () {
  // Les cartes sont déjà enregistrées dans la BDD par le serveur lors de l'achat (openPack) !
  // Il suffit juste de fermer la modale.
  window.closePackModal();
};

window.closePackModal = function () {
  document.getElementById("pack-modal").classList.add("hidden");
  selectedPack = null;
  currentDrawnCards = [];
};
