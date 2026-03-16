// ============================================================================
// PAGE MARCHÉ DES TRANSFERTS
// ============================================================================
import { renderCard } from '../components/cardComponent.js';
import { marketApi } from '../api/marketApi.js';
import { teamApi } from '../api/teamApi.js';

const marketHtml = `
    <div class="max-w-7xl mx-auto p-4 lg:p-8 relative min-h-[calc(100vh-5rem)] flex flex-col">
        
        <div class="bg-slate-900/85 backdrop-blur-xl rounded-2xl border border-cyan-500/50 p-6 mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-10 relative">
            
            <h1 class="font-orbitron text-3xl md:text-4xl font-black text-center bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg mb-8 uppercase tracking-widest">
                MARCHÉ DES TRANSFERTS
            </h1>
            
            <div class="flex flex-wrap justify-center gap-2 md:gap-4 mb-6">
                <button id="tab-buy" class="market-tab tab-active px-4 md:px-8 py-3 font-orbitron font-bold flex items-center gap-2 transition-all">
                    <i data-lucide="shopping-cart" class="w-5 h-5"></i> ACHETER
                </button>
                <button id="tab-sell" class="market-tab tab-inactive px-4 md:px-8 py-3 font-orbitron font-bold flex items-center gap-2 transition-all">
                    <i data-lucide="tag" class="w-5 h-5"></i> VENDRE
                </button>
                <button id="tab-my-sales" class="market-tab tab-inactive px-4 md:px-8 py-3 font-orbitron font-bold flex items-center gap-2 transition-all">
                    <i data-lucide="list" class="w-5 h-5"></i> MES VENTES
                </button>
            </div>
            
            <div id="market-filters" class="flex flex-wrap justify-center gap-4 border-t border-slate-700/50 pt-6 transition-all duration-300">
                
                <div class="relative w-full md:w-64">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i data-lucide="search" class="w-5 h-5 text-gray-400"></i>
                    </div>
                    <input type="text" id="filter-name" placeholder="Nom du personnage..." class="bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 focus:border-cyan-400 transition-colors rounded-lg pl-10 pr-4 py-3 text-sm text-white outline-none font-bold tracking-wider shadow-lg w-full">
                </div>

                <select id="filter-role" class="bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 transition-colors rounded-lg px-4 py-3 text-sm text-white outline-none font-bold tracking-wider cursor-pointer shadow-lg">
                    <option value="ALL">TOUS LES RÔLES</option>
                    <option value="Capitaine">Capitaine</option>
                    <option value="Centre">Centre</option>
                    <option value="Bras gauche">Bras gauche</option>
                    <option value="Bras droit">Bras droit</option>
                    <option value="Goal">Gardien (Goal)</option>
                </select>

                <select id="filter-rarity" class="bg-slate-800 border border-purple-500/30 hover:border-purple-400 transition-colors rounded-lg px-4 py-3 text-sm text-white outline-none font-bold tracking-wider cursor-pointer shadow-lg">
                    <option value="ALL">TOUTES LES RARETÉS</option>
                    <option value="common">Commun (Gris)</option>
                    <option value="rare">Rare (Bleu)</option>
                    <option value="epic">Épique (Violet)</option>
                    <option value="legendary">Légendaire (Or)</option>
                </select>
            </div>

        </div>

        <div id="market-content" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 z-0 relative pb-10 place-items-center">
            <div class="col-span-full text-center py-10"><i data-lucide="loader-2" class="w-12 h-12 text-cyan-500 animate-spin mx-auto"></i></div>
        </div>

    </div>
`;

let currentTab = 'buy';
let allOffers = [];
let myInventory = [];
let currentUser = null;

export async function initMarketPage() {
    document.getElementById('app-content').innerHTML = marketHtml;
    lucide.createIcons();
    
    const userStr = sessionStorage.getItem('currentUser');
    if (!userStr) return;
    currentUser = JSON.parse(userStr);
    
    setupTabs();
    
    // Ajout des écouteurs sur tous les filtres pour rafraîchir l'affichage instantanément
    document.getElementById('filter-role').addEventListener('change', refreshCurrentTabDisplay);
    document.getElementById('filter-rarity').addEventListener('change', refreshCurrentTabDisplay);
    document.getElementById('filter-name').addEventListener('input', refreshCurrentTabDisplay);

    await loadTabContent('buy');
}

/**
 * Normalise la carte pour trouver les informations où qu'elles soient
 */
function normalizeCard(item) {
    if (!item) return {};
    if (item.name && item.rarity) return item;
    const hiddenCard = item.card || item.userCard;
    if (hiddenCard && hiddenCard.name) return hiddenCard;
    const t = item.cardTemplate || item.card_template;
    if (t) {
        return {
            id: item.id, templateId: t.id, name: t.name, role: t.role, rarity: t.rarity,
            overall: t.overall || t.overallRating,
            vitesse: t.vitesse, dribble: t.dribble, tir: t.tir, defense: t.defense, passe: t.passe, force: t.force,
            imageUrl: t.image_url || t.imageUrl || item.imageUrl,
            count: item.quantity || 1
        };
    }
    return item;
}

/**
 * Fonction maîtresse de filtrage (utilisée pour tous les onglets)
 */
function filterData(list) {
    const roleF = document.getElementById('filter-role').value.toLowerCase();
    const rarityF = document.getElementById('filter-rarity').value.toLowerCase();
    const nameF = document.getElementById('filter-name').value.toLowerCase();

    return list.filter(item => {
        const card = normalizeCard(item);
        const matchRole = roleF === 'all' || (card.role && card.role.toLowerCase() === roleF);
        const matchRarity = rarityF === 'all' || (card.rarity && card.rarity.toLowerCase() === rarityF);
        const matchName = !nameF || (card.name && card.name.toLowerCase().includes(nameF));
        return matchRole && matchRarity && matchName;
    });
}

/**
 * Rafraîchit visuellement l'onglet actuel sans refaire de requête à la base de données
 */
function refreshCurrentTabDisplay() {
    if (currentTab === 'buy') {
        let offersToShow = allOffers.filter(o => o.seller && o.seller.id !== currentUser.id);
        renderBuyMarket(offersToShow);
    } 
    else if (currentTab === 'my-sales') {
        let myOffers = allOffers.filter(o => o.seller && o.seller.id === currentUser.id);
        renderMySales(myOffers);
    }
    else if (currentTab === 'sell') {
        renderSellInventory(myInventory);
    }
}

/**
 * Charge les données depuis la base de données quand on change d'onglet
 */
async function loadTabContent(tab) {
    currentTab = tab;
    const container = document.getElementById('market-content');
    
    container.innerHTML = `<div class="col-span-full text-center py-10"><i data-lucide="loader-2" class="w-12 h-12 text-cyan-500 animate-spin mx-auto"></i></div>`;
    lucide.createIcons();

    // On réinitialise la barre de recherche en changeant d'onglet (optionnel, mais plus propre)
    document.getElementById('filter-name').value = '';

    try {
        if (tab === 'buy' || tab === 'my-sales') {
            allOffers = await marketApi.getAllOffers();
        } else if (tab === 'sell') {
            myInventory = await teamApi.getMyCards(currentUser.id);
        }
        refreshCurrentTabDisplay();
    } catch (e) {
        console.error(e);
        container.innerHTML = `<div class="col-span-full text-red-500 text-center font-orbitron font-bold">Erreur de chargement des données.</div>`;
    }
}

function renderBuyMarket(listings) {
    const container = document.getElementById('market-content');
    const filteredListings = filterData(listings);

    if (filteredListings.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-600 w-full max-w-2xl">
                <i data-lucide="search-x" class="w-16 h-16 text-slate-500 mx-auto mb-4"></i>
                <p class="font-orbitron font-bold text-gray-400 text-lg">AUCUNE OFFRE TROUVÉE</p>
            </div>`;
        lucide.createIcons();
        return;
    }

    container.innerHTML = filteredListings.map(listing => {
        const card = normalizeCard(listing);
        const sellerName = listing.seller && listing.seller.username ? listing.seller.username : 'Inconnu';
        return `
        <div class="flex flex-col items-center gap-4 transition-transform hover:-translate-y-2 w-full max-w-[220px]">
            <div class="text-xs text-cyan-400 font-bold bg-slate-900 px-3 py-1 rounded-full border border-cyan-800 mb-[-10px] z-10">
                Vendeur: ${sellerName}
            </div>
            <div class="pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                ${renderCard(card, false, false)}
            </div>
            <button onclick="window.buyMarketCard(${listing.listingId || listing.id}, ${listing.price}, '${card.name.replace(/'/g, "\\'")}')" class="w-full bg-slate-900/80 hover:bg-slate-800 border-2 border-cyan-500/30 hover:border-cyan-400 rounded-xl py-3 flex items-center justify-center gap-2 transition-all shadow-[0_5px_15px_rgba(0,0,0,0.5)] group">
                <span class="font-orbitron font-black text-yellow-500 group-hover:text-yellow-400 text-xl tracking-wider">${listing.price}</span>
                <i data-lucide="coins" class="w-5 h-5 text-yellow-500 group-hover:text-yellow-400"></i>
            </button>
        </div>
        `;
    }).join('');
    lucide.createIcons();
}

function renderMySales(listings) {
    const container = document.getElementById('market-content');
    const filteredListings = filterData(listings);

    if (filteredListings.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center text-gray-400 py-10 font-orbitron font-bold text-xl">Aucune de vos offres ne correspond.</div>`;
        return;
    }

    container.innerHTML = filteredListings.map(listing => {
        const card = normalizeCard(listing);
        return `
        <div class="flex flex-col items-center gap-4 w-full max-w-[220px] transition-transform hover:-translate-y-1">
            <div class="text-xs text-orange-400 font-bold bg-slate-900 px-3 py-1 rounded-full border border-orange-800 mb-[-10px] z-10">
                En vente : ${listing.price} <i data-lucide="coins" class="inline w-3 h-3 text-yellow-500"></i>
            </div>
            <div class="pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                ${renderCard(card, false, false)}
            </div>
            <button onclick="window.cancelMyOffer(${listing.listingId || listing.id}, '${card.name.replace(/'/g, "\\'")}')" class="w-full bg-red-900/80 hover:bg-red-800 border-2 border-red-500/30 hover:border-red-400 rounded-xl py-2 flex items-center justify-center gap-2 transition-all shadow-[0_5px_15px_rgba(0,0,0,0.5)] text-white font-orbitron font-bold text-sm">
                <i data-lucide="x-circle" class="w-4 h-4"></i> ANNULER VENTE
            </button>
        </div>
        `;
    }).join('');
    lucide.createIcons();
}

function renderSellInventory(inventory) {
    const container = document.getElementById('market-content');
    const filteredInventory = filterData(inventory);

    if (filteredInventory.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center text-gray-400 py-10 font-orbitron font-bold text-xl">Aucune carte correspondante dans votre inventaire.</div>`;
        return;
    }

    container.innerHTML = filteredInventory.map(item => {
        const card = normalizeCard(item);
        return `
        <div class="flex flex-col items-center gap-4 transition-transform hover:-translate-y-2 w-full max-w-[220px]">
            <div class="pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                ${renderCard(card, false, false)}
            </div>
            <button onclick="window.sellMyCard(${card.id}, '${card.name.replace(/'/g, "\\'")}')" class="w-full bg-slate-900/80 hover:bg-slate-800 border-2 border-purple-500/30 hover:border-purple-400 rounded-xl py-3 font-orbitron font-bold text-purple-400 transition-all shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                METTRE EN VENTE
            </button>
        </div>
        `;
    }).join('');
}

// ==========================================
// ACTIONS DU MARCHÉ
// ==========================================

window.buyMarketCard = async function(offerId, price, cardName) {
    if (currentUser.coins < price) {
        alert(`❌ Fonds insuffisants ! Il vous manque ${price - currentUser.coins} coins.`);
        return;
    }
    if(confirm(`Confirmer l'achat de ${cardName} pour ${price} coins ?`)) {
        try {
            await marketApi.buyCard(currentUser.id, offerId);
            currentUser.coins -= price;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            document.getElementById('nav-coins').innerText = currentUser.coins;
            alert(`✅ Transaction validée ! ${cardName} a été ajouté(e) à votre collection.`);
            loadTabContent('buy'); 
        } catch (error) {
            alert("Erreur lors de l'achat : " + error.message);
        }
    }
}

window.sellMyCard = async function(userCardId, cardName) {
    const price = prompt(`A quel prix souhaitez-vous vendre ${cardName} ?`);
    if (price && !isNaN(price) && parseInt(price) > 0) {
        try {
            await marketApi.sellCard(currentUser.id, userCardId, parseInt(price));
            alert(`✅ ${cardName} a été mis(e) en vente pour ${price} coins !`);
            loadTabContent('my-sales'); 
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    } else if (price !== null) {
        alert("❌ Prix invalide. Veuillez entrer un nombre supérieur à 0.");
    }
}

window.cancelMyOffer = async function(offerId, cardName) {
    if(confirm(`Voulez-vous vraiment retirer ${cardName} du marché ?`)) {
        try {
            await marketApi.cancelOffer(currentUser.id, offerId);
            alert(`✅ ${cardName} a été retiré(e) du marché et est de retour dans votre inventaire.`);
            loadTabContent('my-sales'); 
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    }
}

function setupTabs() {
    const tabs = ['tab-buy', 'tab-sell', 'tab-my-sales'];
    tabs.forEach(tabId => {
        const btn = document.getElementById(tabId);
        if(btn) {
            btn.addEventListener('click', () => {
                tabs.forEach(t => {
                    const el = document.getElementById(t);
                    el.classList.remove('tab-active');
                    el.classList.add('tab-inactive');
                });
                btn.classList.remove('tab-inactive');
                btn.classList.add('tab-active');
                
                const tabName = tabId.replace('tab-', '');
                loadTabContent(tabName);
            });
        }
    });
}