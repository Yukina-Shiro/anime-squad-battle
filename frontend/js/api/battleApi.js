import { fetchApi } from "./apiClient.js";

export const battleApi = {
  /**
   * Récupère la liste des adversaires (Tous les joueurs sauf nous)
   */
  getOpponents: async (currentUserId) => {
    try {
      // Utilisation de notre fetchApi robuste
      const users = await fetchApi(`/users`);
      // On retourne tout le monde sauf le joueur actuel
      return users.filter((user) => user.id !== currentUserId);
    } catch (error) {
      console.error("Erreur API getOpponents:", error);
      return [];
    }
  },

  /**
   * Lance le vrai combat
   */
  playMatch: async (attackerUserId, defenderUserId) => {
    try {
      return await fetchApi(
        `/battles/fight?attackerUserId=${attackerUserId}&defenderUserId=${defenderUserId}`,
        {
          method: "POST",
        },
      );
    } catch (error) {
      console.error("Erreur API playMatch:", error);
      throw error; // L'erreur sera gérée par la page
    }
  },
};
