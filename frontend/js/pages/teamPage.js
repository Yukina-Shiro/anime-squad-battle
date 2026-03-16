import { teamApi } from "../api/teamApi.js";
import { renderCard } from "../components/cardComponent.js";
import { initDragAndDrop } from "../utils/dragdrop.js";

const teamHtml = `
    <div class="max-w-[100rem] mx-auto p-4 lg:p-6 flex flex-col xl:flex-row gap-6 h-[calc(100vh-5rem)]">
        
        <div class="flex-1 flex flex-col rounded-2xl border-2 border-cyan-500/50 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.2)] bg-[#030a14]">
            
            <div class="flex-none flex justify-between items-center px-6 py-4 bg-[#030a14] border-b-2 border-cyan-500/50 z-20 shadow-[0_10px_20px_rgba(0,0,0,0.9)]">
                <h2 class="font-orbitron text-2xl font-bold flex items-center gap-3">
                    <i data-lucide="layout-grid" class="w-6 h-6 text-cyan-400"></i> 
                    <span class="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">TERRAIN</span>
                </h2>
                <div class="scouter-container scouter-green">
                    <div class="scouter-visor">
                        <span class="text-[10px] font-bold tracking-widest uppercase opacity-80 mb-[-4px]">POWER LEVEL</span>
                        <span id="team-power" class="scouter-value font-orbitron text-4xl font-black">0</span>
                        <div class="absolute right-2 bottom-2 w-3 h-3 border-b-2 border-r-2 border-current"></div>
                    </div>
                    <div class="scouter-earpiece">
                        <div class="scouter-earpiece-speaker"></div>
                        <div class="scouter-earpiece-btn"></div>
                    </div>
                </div>
            </div>

            <div class="flex-1 bg-cyber-pitch relative overflow-y-auto p-6 scrollbar-hide">
                <div class="relative max-w-4xl mx-auto py-4 pt-24 z-10">
                    <div class="flex flex-col items-center gap-8">
                        
                        <div class="card-slot w-[11rem] h-[18.5rem] border-2 border-dashed border-yellow-500/50 rounded-2xl flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all overflow-hidden" data-position="captain">
                        </div>

                        <div class="flex items-center justify-center w-full gap-4 md:gap-12 relative">
                            <div class="card-slot w-[11rem] h-[18.5rem] border-2 border-dashed border-purple-500/50 rounded-2xl flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all overflow-hidden" data-position="leftArm">
                            </div>
                            
                            <div class="card-slot w-[11rem] h-[18.5rem] border-2 border-dashed border-blue-500/50 rounded-2xl flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all overflow-hidden" data-position="center">
                            </div>

                            <div class="card-slot w-[11rem] h-[18.5rem] border-2 border-dashed border-purple-500/50 rounded-2xl flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all overflow-hidden" data-position="rightArm">
                            </div>
                        </div>

                        <div class="relative mt-4">
                            <div class="goal-net"></div>
                            <div class="card-slot relative z-10 w-[11rem] h-[18.5rem] border-2 border-dashed border-cyan-500/50 rounded-2xl flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm transition-all overflow-hidden" data-position="goal">
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <div class="w-full xl:w-[450px] flex-shrink-0 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-purple-500/50 flex flex-col h-[50vh] xl:h-full shadow-2xl overflow-hidden">
            
            <div class="p-6 pb-4">
                <h3 class="font-orbitron text-xl font-bold text-white mb-4"><i data-lucide="backpack" class="inline w-5 h-5 text-purple-400 mr-2"></i> INVENTAIRE</h3>
                <select id="filter-role" class="w-full bg-slate-800 border-none outline-none focus:ring-0 text-white px-4 py-3 rounded-xl text-center font-bold">
                    <option value="ALL">TOUS LES RÔLES</option>
                    <option value="Goal">Gardien</option>
                    <option value="Capitaine">Attaquant (Capitaine)</option>
                    <option value="Centre">Milieu</option>
                    <option value="Bras gauche">Ailier Gauche</option>
                    <option value="Bras droit">Ailier Droit</option>
                </select>
            </div>
            
            <div id="inventory-container" class="flex-1 overflow-y-auto px-6 pb-6 grid grid-cols-2 gap-4 place-items-center auto-rows-max">
                <div class="text-gray-400 col-span-2 text-center py-10"><i data-lucide="loader" class="w-8 h-8 animate-spin mx-auto"></i> Chargement...</div>
            </div>
        </div>
    </div>
`;

// Variables d'état
let myCards = [];
let currentTeam = null;

// ==========================================
// 1. INITIALISATION ET HYDRATATION
// ==========================================
export async function initTeamPage() {
  document.getElementById("app-content").innerHTML = teamHtml;
  if (window.lucide) lucide.createIcons();

  const userStr = localStorage.getItem("user");
  if (!userStr) return;
  const user = JSON.parse(userStr);

  try {
    const rawCards = await teamApi.getMyCards(user.id);
    const rawTeam = await teamApi.getMyTeam(user.id);

    const safeRawCards = Array.isArray(rawCards) ? rawCards : [];
    currentTeam = Array.isArray(rawTeam) ? rawTeam[0] || {} : rawTeam || {};

    myCards = safeRawCards.map((uc) => {
      const tpl = uc.cardTemplate || uc.card || uc || {};
      return {
        id: uc.id,
        name: tpl.name || "Inconnu",
        rarity: tpl.rarity || "COMMON",
        role: tpl.role || "Inconnu",
        overall: tpl.overallRating || tpl.overall || 0,
        vitesse: tpl.vitesse || 0,
        force: tpl.force || 0,
        dribble: tpl.dribble || 0,
        defense: tpl.defense || 0,
        tir: tpl.tir || 0,
        passe: tpl.passe || 0,
        imageUrl: tpl.imageUrl || tpl.image_url || tpl.image || "",
      };
    });

    initializeEmptySlots();
    hydrateTerrain();
    renderInventory();

    document
      .getElementById("filter-role")
      .addEventListener("change", renderInventory);
  } catch (error) {
    console.error("Erreur de chargement:", error);
  }
}

// ==========================================
// 2. GESTION DU TERRAIN
// ==========================================
function initializeEmptySlots() {
  const placeholders = {
    captain:
      '<i data-lucide="crown" class="w-8 h-8 text-yellow-500 mb-2 opacity-50"></i><span class="text-yellow-500/50 font-orbitron text-sm font-bold tracking-widest">ATTAQUANT</span>',
    leftArm:
      '<i data-lucide="arrow-left" class="w-8 h-8 text-purple-500 mb-2 opacity-50"></i><span class="text-purple-500/50 font-orbitron text-sm font-bold">AILIER G.</span>',
    center:
      '<i data-lucide="target" class="w-8 h-8 text-blue-500 mb-2 opacity-50"></i><span class="text-blue-500/50 font-orbitron text-sm font-bold">MILIEU</span>',
    rightArm:
      '<i data-lucide="arrow-right" class="w-8 h-8 text-purple-500 mb-2 opacity-50"></i><span class="text-purple-500/50 font-orbitron text-sm font-bold">AILIER D.</span>',
    goal: '<i data-lucide="shield" class="w-8 h-8 text-cyan-500 mb-2 opacity-50"></i><span class="text-cyan-500/50 font-orbitron text-sm font-bold tracking-widest">GARDIEN</span>',
  };

  Object.keys(placeholders).forEach((pos) => {
    const slot = document.querySelector(`.card-slot[data-position="${pos}"]`);
    if (slot) slot.innerHTML = placeholders[pos];
  });
}

function hydrateTerrain() {
  const positions = ["captain", "leftArm", "center", "rightArm", "goal"];
  let power = 0;

  positions.forEach((pos) => {
    const cardDataInTeam = currentTeam[pos];
    const userCardId =
      typeof cardDataInTeam === "object" && cardDataInTeam !== null
        ? cardDataInTeam.id
        : cardDataInTeam;

    if (userCardId) {
      const card = myCards.find((c) => String(c.id) === String(userCardId));
      if (card) {
        power += card.overall;
        placeCardInSlot(card, pos);
      }
    }
  });

  document.getElementById("team-power").innerText = power;
  if (window.lucide) lucide.createIcons();
}

function placeCardInSlot(card, position) {
  const slotElement = document.querySelector(
    `.card-slot[data-position="${position}"]`,
  );
  if (!slotElement) return;

  slotElement.innerHTML = `
        <div class="relative w-full h-full flex items-center justify-center group cursor-pointer rounded-xl overflow-hidden">
            ${renderCard(card, false, false)}
            
            <div onclick="window.removeCardFromSlot('${position}')" 
                 class="absolute inset-0 bg-red-900/85 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 z-20">
                <i data-lucide="x-circle" class="w-12 h-12 text-white mb-2 shadow-lg rounded-full"></i>
                <span class="text-white font-bold font-orbitron text-sm tracking-widest drop-shadow-md">RETIRER</span>
            </div>
        </div>
    `;

  slotElement.classList.remove("border-dashed", "bg-slate-900/60");
  slotElement.classList.add("border-solid", "bg-slate-900/80");
}

// ==========================================
// 3. GESTION DE L'INVENTAIRE ET DRAG & DROP
// ==========================================
function renderInventory() {
  const container = document.getElementById("inventory-container");
  const filter = document.getElementById("filter-role").value;

  const teamCardIds = Object.values(currentTeam)
    .map((v) =>
      typeof v === "object" && v !== null ? String(v.id) : String(v),
    )
    .filter((id) => id && id !== "undefined");

  let availableCards = myCards.filter(
    (c) => !teamCardIds.includes(String(c.id)),
  );

  if (filter !== "ALL") {
    availableCards = availableCards.filter(
      (c) => c.role && c.role.toLowerCase() === filter.toLowerCase(),
    );
  }

  if (availableCards.length === 0) {
    container.innerHTML = `<p class="text-gray-500 col-span-2 text-center mt-10">Aucune carte disponible.</p>`;
    return;
  }

  container.innerHTML = availableCards
    .map((card) => renderCard(card, false, true))
    .join("");

  // Initialise le Drag & Drop avec la fonction handleCardDrop !
  initDragAndDrop(handleCardDrop);
}

// Fonction appelée quand une carte est déposée
async function handleCardDrop(cardId, position, slotElement) {
  const card = myCards.find((c) => String(c.id) === String(cardId));
  if (!card) return;

  const roleRequirements = {
    captain: "Capitaine",
    leftArm: "Bras gauche",
    center: "Centre",
    rightArm: "Bras droit",
    goal: "Goal",
  };

  if (card.role !== roleRequirements[position]) {
    alert(
      `❌ Action impossible : Cette carte a le rôle "${card.role}", mais cet emplacement est réservé au rôle "${roleRequirements[position]}".`,
    );
    slotElement.classList.remove("bg-cyan-900/60", "border-cyan-400");
    return;
  }

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  try {
    slotElement.innerHTML = `<i data-lucide="loader-2" class="w-8 h-8 text-cyan-400 animate-spin"></i>`;
    if (window.lucide) lucide.createIcons();

    const teamId = currentTeam.id || 1;
    await teamApi.swapCard(teamId, user.id, position, card.id);

    currentTeam[position] = card.id;
    const positions = ["captain", "leftArm", "center", "rightArm", "goal"];
    positions.forEach((pos) => {
      if (
        pos !== position &&
        String(currentTeam[pos]?.id || currentTeam[pos]) === String(card.id)
      ) {
        currentTeam[pos] = null;
      }
    });

    initializeEmptySlots();
    hydrateTerrain();
    renderInventory();
  } catch (error) {
    alert("Déplacement impossible : " + error.message);
    initializeEmptySlots();
    hydrateTerrain();
    renderInventory();
  }
}

// Fonction appelée au clic sur l'overlay rouge "RETIRER"
window.removeCardFromSlot = async function (position) {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const teamId = currentTeam.id || 1;

  const slotElement = document.querySelector(
    `.card-slot[data-position="${position}"]`,
  );
  const backupHtml = slotElement.innerHTML;

  try {
    slotElement.innerHTML = `<i data-lucide="loader-2" class="w-8 h-8 text-red-500 animate-spin"></i>`;
    if (window.lucide) lucide.createIcons();

    await teamApi.removeCard(teamId, user.id, position);

    currentTeam[position] = null;

    initializeEmptySlots();
    hydrateTerrain();
    renderInventory();
  } catch (error) {
    alert("Erreur lors du retrait : " + error.message);
    slotElement.innerHTML = backupHtml;
    if (window.lucide) lucide.createIcons();
  }
};
