/**
 * Filtre un tableau de cartes selon la rareté et le rôle.
 * @param {Array} cards - Le tableau de cartes à filtrer.
 * @param {string} rarity - La rareté choisie (ou 'ALL').
 * @param {string} role - Le rôle choisi (ou 'ALL').
 * @returns {Array} - Le tableau filtré.
 */
export function filterCards(cards, rarity, role) {
    return cards.filter(card => {
        const matchRarity = (rarity === 'all' || !rarity) ? true : card.rarity === rarity;
        const matchRole = (role === 'all' || !role) ? true : card.role === role;
        return matchRarity && matchRole;
    });
}

/**
 * Groupe les cartes identiques pour calculer les doublons (pour l'affichage x2, x3...).
 * @param {Array} cards - La liste brute de toutes les instances de cartes du joueur.
 * @returns {Array} - Une liste de cartes uniques avec une propriété "count".
 */
export function groupDuplicateCards(cards) {
    const grouped = {};
    
    cards.forEach(card => {
        // On utilise le nom comme clé unique (dans un vrai jeu, on utiliserait le cardTemplate.id)
        if (grouped[card.name]) {
            grouped[card.name].count += 1;
        } else {
            // On clone la carte et on initialise son compteur à 1
            grouped[card.name] = { ...card, count: 1 };
        }
    });
    
    // On convertit l'objet métier en tableau classique
    return Object.values(grouped);
}