// js/api/authApi.js

const BASE_URL = "http://localhost:8080/api/users";

export const authApi = {
  // INSCRIPTION
  register: async (username, password) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'inscription");
      }

      const userData = await response.json();
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Erreur API Register:", error);
      throw error;
    }
  },

  // CONNEXION (Vers la vraie BDD)
  login: async (username, password) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Mauvais pseudo ou mot de passe");
      }

      const userData = await response.json();
      // On sauvegarde le UserResponseDTO dans le navigateur
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Erreur API Login:", error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("user");
    window.location.reload(); // Recharge la page pour revenir à l'écran de base
  },

  // Récupérer le joueur actuel
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};
