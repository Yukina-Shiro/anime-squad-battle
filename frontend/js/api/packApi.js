// js/api/packApi.js

const BASE_URL = 'http://localhost:8080/api/market/packs';

export const packApi = {
    openPack: async (userId, packType) => {
        try {
            const response = await fetch(`${BASE_URL}/open?userId=${userId}&packType=${packType}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                // Récupère le message d'erreur du backend (ex: "Fonds insuffisants")
                const errorText = await response.text(); 
                throw new Error(errorText || "Erreur lors de l'ouverture du pack");
            }

            return await response.json(); // Renvoie la liste des 5 UserCard tirées !
        } catch (error) {
            console.error("Erreur API Open Pack:", error);
            throw error;
        }
    }
};