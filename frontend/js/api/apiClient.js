// URL de ton backend Spring Boot local
const BASE_URL = "http://localhost:8080/api";

/**
 * Fonction centrale pour faire les appels réseaux.
 * @param {string} endpoint - La route (ex: '/users/login')
 * @param {object} options - Options fetch (method, body, etc.)
 */
export async function fetchApi(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Si le serveur renvoie une erreur
    if (!response.ok) {
      let errorMessage = "Erreur serveur";
      try {
        // On tente de lire l'erreur JSON formatée par ton GlobalExceptionHandler
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        errorMessage = await response.text();
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error; // Relance l'erreur pour la bloquer dans le composant
  }
}

/**
 * Récupère l'inventaire complet d'un joueur
 */
export async function getUserCards(userId) {
  return await fetchApi(`/users/${userId}/cards`);
}
