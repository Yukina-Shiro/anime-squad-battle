import { teamApi } from "../api/teamApi.js";
import { battleApi } from "../api/battleApi.js";
import { renderCard } from "../components/cardComponent.js";

const battleHtml = `
    <div class="max-w-[100rem] mx-auto p-4 lg:p-6 flex flex-col xl:flex-row gap-6 h-[calc(100vh-5rem)]">
        
        <div class="flex-1 flex flex-col rounded-2xl border-2 border-red-500/50 overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.2)] bg-[#030a14]">

            <div class="flex-none flex justify-between items-center px-6 py-4 bg-[#030a14] border-b-2 border-red-500/50 z-20 shadow-[0_10px_20px_rgba(0,0,0,0.9)]">
                <h2 class="font-orbitron text-2xl font-bold flex items-center gap-3">
                    <i data-lucide="swords" class="w-6 h-6 text-red-500"></i> 
                    <span class="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">PRÊT AU COMBAT</span>
                </h2>
                <div class="scouter-container scouter-red">
                    <div class="scouter-visor">
                        <span class="text-[10px] font-bold tracking-widest uppercase opacity-80 mb-[-4px]">COMBAT LEVEL</span>
                        <span id="battle-team-power" class="scouter-value font-orbitron text-4xl font-black">0</span>
                        <div class="absolute right-2 bottom-2 w-3 h-3 border-b-2 border-r-2 border-current"></div>
                    </div>
                    <div class="scouter-earpiece">
                        <div class="scouter-earpiece-speaker"></div>
                        <div class="scouter-earpiece-btn"></div>
                    </div>
                </div>
            </div>

            <div class="flex-1 bg-cyber-pitch relative overflow-y-auto p-6 scrollbar-hide">
                <div class="relative max-w-4xl mx-auto py-4 pt-24 z-10 pointer-events-none">
                    <div class="flex flex-col items-center gap-8">
                        <div class="card-slot w-[11rem] h-[18.5rem] border-2 border-solid border-slate-700 rounded-2xl flex flex-col items-center justify-center bg-slate-900/80" id="battle-captain"></div>
                        
                        <div class="flex items-center justify-center w-full gap-4 md:gap-12">
                            <div class="card-slot w-[11rem] h-[18.5rem] border-2 border-solid border-slate-700 rounded-2xl flex flex-col items-center justify-center bg-slate-900/80" id="battle-leftArm"></div>
                            <div class="card-slot w-[11rem] h-[18.5rem] border-2 border-solid border-slate-700 rounded-2xl flex flex-col items-center justify-center bg-slate-900/80" id="battle-center"></div>
                            <div class="card-slot w-[11rem] h-[18.5rem] border-2 border-solid border-slate-700 rounded-2xl flex flex-col items-center justify-center bg-slate-900/80" id="battle-rightArm"></div>
                        </div>
                        
                        <div class="relative mt-4">
                            <div class="goal-net" style="border-color: var(--neon-pink); box-shadow: 0 0 20px var(--neon-pink), inset 0 0 20px var(--neon-pink);"></div>
                            <div class="card-slot relative z-10 w-[11rem] h-[18.5rem] border-2 border-solid border-slate-700 rounded-2xl flex flex-col items-center justify-center bg-slate-900/80" id="battle-goal"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-full xl:w-[450px] flex-shrink-0 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-orange-500/50 p-8 flex flex-col justify-center shadow-2xl">
            <div class="text-center">
                <h3 class="font-orbitron text-2xl text-white mb-8"><i data-lucide="crosshair" class="inline w-6 h-6 text-orange-500 mr-2"></i> ZONE DE COMBAT</h3>
                
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p class="text-xs text-gray-400 mb-2">VICTOIRE</p>
                        <p class="font-orbitron text-2xl font-bold text-green-400 flex items-center justify-center gap-2">
                            <i data-lucide="coins" class="w-5 h-5"></i> +500
                        </p>
                    </div>
                    <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <p class="text-xs text-gray-400 mb-2">CONSOLATION</p>
                        <p class="font-orbitron text-2xl font-bold text-gray-300 flex items-center justify-center gap-2">
                            <i data-lucide="coins" class="w-5 h-5 text-yellow-500"></i> +50
                        </p>
                    </div>
                </div>

                <div class="mb-8 text-left bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <label class="text-xs font-bold tracking-widest text-cyan-400 font-orbitron mb-2 block flex items-center gap-2">
                        <i data-lucide="users" class="w-4 h-4"></i> CHOISIR UN ADVERSAIRE :
                    </label>
                    <select id="select-defender" class="w-full bg-slate-950 border border-cyan-500/50 rounded-lg p-3 text-white font-orbitron font-bold outline-none focus:border-cyan-400 text-center text-lg cursor-pointer shadow-inner">
                        <option value="">Chargement...</option>
                    </select>
                </div>

                <button id="btn-start-battle" class="w-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 hover:from-red-500 hover:via-orange-400 hover:to-yellow-400 text-white font-bold py-6 rounded-xl font-orbitron text-2xl tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] flex items-center justify-center gap-3">
                    <i data-lucide="zap" class="w-8 h-8"></i> 
                    LANCER MATCH
                </button>
                
                <div class="mt-8 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <p id="battle-status" class="text-gray-300 font-bold font-orbitron">En attente d'un adversaire...</p>
                </div>
            </div>
        </div>

    </div>
`;

export async function initBattlePage() {
  document.getElementById("app-content").innerHTML = battleHtml;
  if (window.lucide) lucide.createIcons();

  // On utilise localStorage pour stocker la monnaie
  const userStr = localStorage.getItem("user");
  if (!userStr) return;
  let user = JSON.parse(userStr);

  try {
    const rawCards = await teamApi.getMyCards(user.id);
    const rawTeam = await teamApi.getMyTeam(user.id);

    const safeRawCards = Array.isArray(rawCards) ? rawCards : [];
    const currentTeam = Array.isArray(rawTeam)
      ? rawTeam[0] || {}
      : rawTeam || {};

    // Lecture des données de Spring Boot
    const formattedCards = safeRawCards.map((uc) => {
      const tpl = uc.cardTemplate || uc.card || uc || {};
      return {
        id: uc.id || tpl.id || 0,
        name: tpl.name || tpl.Name || "Inconnu",
        rarity: tpl.rarity || tpl.Rarity || "COMMON",
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

    let teamPower = 0;
    const positions = ["captain", "leftArm", "center", "rightArm", "goal"];

    positions.forEach((pos) => {
      const slot = document.getElementById(`battle-${pos}`);
      if (!slot) return;

      const cardDataInTeam = currentTeam[pos];
      // Extraction robuste de l'ID (au cas où le serveur renvoie un objet complet)
      const userCardId =
        typeof cardDataInTeam === "object" && cardDataInTeam !== null
          ? cardDataInTeam.id
          : cardDataInTeam;

      if (userCardId) {
        const card = formattedCards.find(
          (c) => String(c.id) === String(userCardId),
        );
        if (card) {
          slot.innerHTML = renderCard(card, false, false);
          teamPower += card.overall;
        } else {
          slot.innerHTML = `<span class="text-slate-600 font-orbitron text-sm font-bold">INTROUVABLE</span>`;
        }
      } else {
        slot.innerHTML = `<span class="text-slate-600 font-orbitron text-sm font-bold">VIDE</span>`;
      }
    });

    const powerElement = document.getElementById("battle-team-power");
    if (powerElement) powerElement.innerText = teamPower;
  } catch (e) {
    console.warn("L'équipe n'a pas pu être chargée : ", e);
  }

  // Chargement des adversaires
  const selectDefender = document.getElementById("select-defender");
  const opponents = await battleApi.getOpponents(user.id);

  if (opponents.length === 0) {
    selectDefender.innerHTML = `<option value="">Aucun joueur disponible</option>`;
    selectDefender.disabled = true;
  } else {
    selectDefender.innerHTML = opponents
      .map(
        (opp) =>
          `<option value="${opp.id}">${opp.username} (${opp.wins || 0} V, ${opp.losses || 0} D)</option>`,
      )
      .join("");
  }

  // 4. LOGIQUE DU COMBAT
  const btnBattle = document.getElementById("btn-start-battle");
  const statusText = document.getElementById("battle-status");

  if (btnBattle) {
    btnBattle.addEventListener("click", async () => {
      const defenderId = document.getElementById("select-defender").value;

      if (!defenderId) {
        alert("Veuillez choisir un adversaire valide !");
        return;
      }

      btnBattle.disabled = true;
      btnBattle.classList.remove("hover:scale-105");
      btnBattle.innerHTML = `<i data-lucide="loader-2" class="w-8 h-8 animate-spin"></i> COMBAT...`;
      if (statusText) {
        statusText.innerText = "Simulation du match en cours...";
        statusText.className =
          "text-orange-400 font-bold font-orbitron animate-pulse";
      }
      if (window.lucide) lucide.createIcons();

      try {
        const result = await battleApi.playMatch(user.id, defenderId);

        // CORRECTION : Sauvegarde des gains dans localStorage
        user.coins += result.coinsEarned;
        localStorage.setItem("user", JSON.stringify(user));

        const navCoins = document.getElementById("nav-coins");
        if (navCoins) navCoins.innerText = user.coins;

        if (result.victory) {
          btnBattle.className =
            "w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-6 rounded-xl font-orbitron tracking-widest shadow-[0_0_30px_rgba(34,197,94,0.5)] flex flex-col items-center justify-center gap-1";
          btnBattle.innerHTML = `<span class="text-xl">🎉 VICTOIRE !</span><span class="text-sm font-bold text-yellow-300">SCORE : ${result.attackerScore} - ${result.defenderScore}</span>`;
          if (statusText) {
            statusText.innerText = result.message;
            statusText.className = "text-green-400 font-bold font-orbitron";
          }
        } else {
          btnBattle.className =
            "w-full bg-gradient-to-r from-red-800 to-red-900 text-gray-300 font-bold py-6 rounded-xl font-orbitron tracking-widest border border-red-500 flex flex-col items-center justify-center gap-1";
          btnBattle.innerHTML = `<span class="text-xl">💀 DÉFAITE</span><span class="text-sm font-bold text-red-300">SCORE : ${result.attackerScore} - ${result.defenderScore}</span>`;
          if (statusText) {
            statusText.innerText = result.message;
            statusText.className = "text-red-500 font-bold font-orbitron";
          }
        }

        setTimeout(() => {
          btnBattle.disabled = false;
          btnBattle.className =
            "w-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 hover:from-red-500 hover:via-orange-400 hover:to-yellow-400 text-white font-bold py-6 rounded-xl font-orbitron text-2xl tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] flex items-center justify-center gap-3";
          btnBattle.innerHTML = `<i data-lucide="zap" class="w-8 h-8"></i> REJOUER`;
          if (statusText) {
            statusText.innerText = "Prêt pour le prochain défi...";
            statusText.className = "text-gray-300 font-bold font-orbitron";
          }
          if (window.lucide) lucide.createIcons();
        }, 3000);
      } catch (error) {
        alert(error.message);
        btnBattle.disabled = false;
        btnBattle.innerHTML = `<i data-lucide="zap" class="w-8 h-8"></i> LANCER MATCH`;
        if (window.lucide) lucide.createIcons();
        if (statusText) {
          statusText.innerText = "Match annulé.";
          statusText.className = "text-gray-500 font-bold font-orbitron";
        }
      }
    });
  }
}
