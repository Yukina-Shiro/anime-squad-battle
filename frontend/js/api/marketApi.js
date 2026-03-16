const BASE_URL = 'http://localhost:8080/api';

export const marketApi = {
    /**
     * Récupère toutes les offres du marché.
     */
    getAllOffers: async () => {
        try {
            const response = await fetch(`${BASE_URL}/market`);
            if (!response.ok) throw new Error("Erreur de récupération du marché");
            
            const offers = await response.json();
            
            // On mappe les données de Spring Boot de façon ultra-sécurisée
            return offers.map(offer => {
                // On récupère la carte physique (userCard)
                const uc = offer.userCard || {};
                // Sécurité : Spring Boot peut l'appeler "cardTemplate" ou "card_template"
                const template = uc.cardTemplate || uc.card_template || {};
                
                return {
                    listingId: offer.id,
                    price: offer.price,
                    seller: offer.seller || {},
                    card: {
                        id: uc.id,
                        templateId: template.id,
                        name: template.name,
                        anime: template.anime,
                        genres: template.genres,
                        role: template.role,
                        rarity: template.rarity,
                        // Gestion des différences de nommage (camelCase vs snake_case)
                        overall: template.overall || template.overallRating,
                        vitesse: template.vitesse,
                        force: template.force,
                        dribble: template.dribble,
                        defense: template.defense,
                        tir: template.tir,
                        passe: template.passe,
                        image: template.image_url || template.imageUrl,
                        imageUrl: template.image_url || template.imageUrl
                    }
                };
            });
        } catch (error) {
            console.error("Erreur API getAllOffers:", error);
            return [];
        }
    },

    /**
     * Achète une carte sur le marché.
     */
    buyCard: async (buyerId, offerId) => {
        try {
            const response = await fetch(`${BASE_URL}/market/buy/${offerId}?buyerId=${buyerId}`, { 
                method: 'POST' 
            });
            if (!response.ok) {
                const err = await response.text();
                throw new Error(err || "Erreur lors de l'achat");
            }
            return { success: true };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Met une carte en vente.
     */
    sellCard: async (sellerId, userCardId, price) => {
        try {
            const response = await fetch(`${BASE_URL}/market/sell?userId=${sellerId}&userCardId=${userCardId}&price=${price}`, { 
                method: 'POST' 
            });
            if (!response.ok) {
                const err = await response.text();
                throw new Error(err || "Erreur lors de la mise en vente");
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    /**
     * Annule une vente.
     */
    cancelOffer: async (sellerId, offerId) => {
        try {
            const response = await fetch(`${BASE_URL}/market/cancel/${offerId}?sellerId=${sellerId}`, { 
                method: 'DELETE' 
            });
            if (!response.ok) {
                const err = await response.text();
                throw new Error(err || "Erreur lors de l'annulation");
            }
            return { success: true };
        } catch (error) {
            throw error;
        }
    }
};