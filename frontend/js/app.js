import { initLoginPage } from './pages/loginPage.js';
import { initHomePage } from './pages/homePage.js';
import { initPacksPage } from './pages/packsPage.js';
import { initNavbar } from './components/navbarComponent.js';
import { initTeamPage } from './pages/teamPage.js';
import { initBattlePage } from './pages/battlePage.js';
import { initCollectionPage } from './pages/collectionPage.js';
import { initMarketPage } from './pages/marketPage.js';

/**
 * Fonction centrale de ROUTAGE.
 * C'est elle qui détruit l'ancienne page et charge la nouvelle.
 * @param {string} pageName - Le nom de la page cible ('login', 'home', 'packs'...)
 */
export function navigateTo(pageName) {
    console.log(`Navigation vers : ${pageName}`);
    
    // 1. Vérification de sécurité (Est-ce que l'utilisateur est connecté ?)
    const isLoggedIn = sessionStorage.getItem('currentUser') !== null;
    
    if (!isLoggedIn && pageName !== 'login') {
        console.warn("Accès refusé. Redirection vers login.");
        navigateTo('login');
        return;
    }

    // 2. Gestion de la barre de navigation
    if (pageName === 'login') {
        document.getElementById('navbar-container').innerHTML = ''; // Cache la navbar
    } else {
        // Si la navbar n'est pas encore affichée, on l'initialise
        if (document.getElementById('navbar-container').innerHTML === '') {
            initNavbar(navigateTo);
        }
    }

    // 3. Effacer le contenu actuel
    document.getElementById('app-content').innerHTML = '';

    // 4. Charger la bonne page
    switch (pageName) {
        case 'login':
            initLoginPage(navigateTo); // On passe la fonction de navigation pour que le login puisse rediriger vers 'home'
            break;
        case 'home':
            initHomePage(navigateTo);
            break;
        case 'packs':
            initPacksPage();
            break;
        case 'team':
            initTeamPage();
            break;
        case 'match':
            initBattlePage();
            break;
        case 'collection':
            initCollectionPage();
            break;
        case 'market':
            initMarketPage();
            break;
        default:
            initHomePage(navigateTo);
    }
}

// Initialisation au lancement du site
document.addEventListener('DOMContentLoaded', () => {
    // On lance le routeur. Il vérifiera la session et redirigera automatiquement vers Login ou Home.
    navigateTo('home'); 
});

// Fonction globale pour se déconnecter
window.logout = function() {
    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
        // 1. On vide les informations du joueur de la mémoire du navigateur
        sessionStorage.removeItem('currentUser');
        
        // 2. On le renvoie de force sur la page de connexion
        window.location.hash = '#login';
        
        // 3. (Optionnel) Recharger la page pour vider totalement la mémoire
        window.location.reload(); 
    }
};