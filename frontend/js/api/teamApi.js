import { fetchApi } from "./apiClient.js";

export const teamApi = {
  // Récupère l'équipe actuelle du joueur
  getMyTeam: async (userId) => {
    return await fetchApi(`/teams/user/${userId}`);
  },

  getMyCards: async (userId) => {
    return await fetchApi(`/users/${userId}/cards`);
  },

  swapCard: async (teamId, userId, role, userCardId) => {
    return await fetchApi(
      `/teams/${teamId}/swap?userId=${userId}&position=${role}&newCardId=${userCardId}`,
      {
        method: "PUT",
      },
    );
  },
  removeCard: async (teamId, userId, role) => {
    return await fetchApi(
      `/teams/${teamId}/remove?userId=${userId}&position=${role}`,
      { method: "PUT" },
    );
  },
};
