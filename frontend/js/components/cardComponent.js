/**
 * Génère le HTML d'une carte à partir d'un objet JSON.
 * @param {Object} card - Les données de la carte venant du backend.
 * @param {boolean} showCount - Affiche ou non le badge x2, x3...
 * @param {boolean} isDraggable - Autorise le Drag & Drop sur cette carte
 * @returns {string} - Le HTML de la carte.
 */
export function renderCard(card, showCount = false, isDraggable = false) {
    if (!card) return '<div>Erreur carte</div>';

    // SÉCURITÉ : Si la rareté manque, on la force à 'common' par défaut
    const safeRarity = card.rarity ? card.rarity.toLowerCase() : 'common';
    const rarityClass = `card-${safeRarity}`;
    
    const rarityColors = {
        legendary: 'text-yellow-400',
        epic: 'text-purple-400',
        rare: 'text-blue-400',
        common: 'text-gray-400'
    };
    const color = rarityColors[safeRarity] || 'text-gray-400';

    // SÉCURITÉ : Valeurs par défaut pour éviter les "undefined" à l'écran
    const safeName = card.name || 'Inconnu';
    const safeRole = card.role || 'Aucun';
    const safeOverall = card.overall || 0;

    const countBadge = (showCount && card.count > 1) 
        ? `<div class="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center z-10 shadow-lg">x${card.count}</div>` 
        : '';

    const dragAttr = isDraggable ? 'draggable="true"' : '';
    const dragClass = isDraggable ? 'draggable cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:shadow-xl hover:z-10' : 'cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:z-10';
    
    const imageHtml = card.imageUrl 
        ? `<img src="${card.imageUrl}" alt="${safeName}" class="w-full h-full object-cover">`
        : `<i data-lucide="user" class="w-10 h-10 text-gray-500"></i>`;

    return `
        <div class="relative ${rarityClass} card-base rounded-xl p-3 w-40 flex-shrink-0 transition-all duration-300 ${dragClass}" 
             data-card-id="${card.id || ''}" ${dragAttr}>
            
            ${countBadge}
            
            <div class="relative w-full h-24 mb-2 overflow-hidden rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center">
                ${imageHtml}
            </div>
            
            <p class="font-orbitron font-bold text-xs text-white text-center truncate mb-2 uppercase tracking-wider">${safeName}</p>
            
            <div class="flex justify-between items-center mb-3 px-1">
                <div class="text-left">
                    <p class="text-[10px] text-gray-400">OVR</p>
                    <p class="font-orbitron text-xl font-bold ${color}">${safeOverall}</p>
                </div>
                <div class="text-right">
                    <p class="text-[10px] text-gray-400">ROLE</p>
                    <p class="text-[10px] font-bold text-white uppercase">${safeRole}</p>
                </div>
            </div>
            
            <div class="grid grid-cols-3 gap-1 text-[10px] bg-slate-900/50 p-1 rounded">
                <div class="text-center"><span class="text-gray-500">PAC</span><br/><span class="font-bold text-white">${card.vitesse || 0}</span></div>
                <div class="text-center"><span class="text-gray-500">DRI</span><br/><span class="font-bold text-white">${card.dribble || 0}</span></div>
                <div class="text-center"><span class="text-gray-500">SHO</span><br/><span class="font-bold text-white">${card.tir || 0}</span></div>
                <div class="text-center"><span class="text-gray-500">DEF</span><br/><span class="font-bold text-white">${card.defense || 0}</span></div>
                <div class="text-center"><span class="text-gray-500">PAS</span><br/><span class="font-bold text-white">${card.passe || 0}</span></div>
                <div class="text-center"><span class="text-gray-500">PHY</span><br/><span class="font-bold text-white">${card.force || 0}</span></div>
            </div>
        </div>
    `;
}