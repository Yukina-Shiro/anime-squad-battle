import { authApi } from '../api/authApi.js';

/**
 * Template HTML de la barre de navigation.
 */
const navbarHtml = `
    <header class="bg-slate-900/90 backdrop-blur-sm border-b border-purple-500/30 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex items-center justify-between h-16">
                
                <div class="font-orbitron text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent cursor-pointer" id="nav-logo" onclick="window.location.hash = '#home'">
                    ASB
                </div>

                <nav class="hidden md:flex items-center space-x-2">
                    <button data-target="home" class="nav-btn px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2 nav-active">
                        <i data-lucide="home" class="w-4 h-4"></i> ACCUEIL
                    </button>
                    <button data-target="team" class="nav-btn px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2">
                        <i data-lucide="users" class="w-4 h-4"></i> ÉQUIPE
                    </button>
                    <button data-target="match" class="nav-btn px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2">
                        <i data-lucide="swords" class="w-4 h-4"></i> JOUER
                    </button>
                    <button data-target="collection" class="nav-btn px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2">
                        <i data-lucide="layers" class="w-4 h-4"></i> COLLECTION
                    </button>
                    <button data-target="market" class="nav-btn px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2">
                        <i data-lucide="store" class="w-4 h-4"></i> MARCHÉ
                    </button>
                    <button data-target="packs" class="nav-btn px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2">
                        <i data-lucide="gift" class="w-4 h-4"></i> PACKS
                    </button>
                </nav>

                <div class="flex items-center gap-4">
                    <div class="hidden sm:flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-yellow-500/30">
                        <i data-lucide="coins" class="w-4 h-4 text-yellow-400"></i> 
                        <span id="nav-coins" class="font-orbitron text-yellow-400 text-sm font-bold">0</span>
                    </div>
                    
                    <button id="btn-logout" class="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-2 rounded-lg border border-red-500/30 transition-all cursor-pointer">
                        <i data-lucide="log-out" class="w-4 h-4"></i>
                        <span class="hidden sm:block text-sm font-medium">Quitter</span>
                    </button>
                </div>
                
            </div>
        </div>
    </header>
`;

/**
 * Initialise la navbar et gère les clics sur le menu.
 * @param {Function} navigateCallback - La fonction du routeur principal pour changer de page
 */
export function initNavbar(navigateCallback) {
    const container = document.getElementById('navbar-container');
    if (!container) return; 

    container.innerHTML = navbarHtml; 
    container.classList.remove('hidden'); 
    
    // Mettre à jour les infos de l'utilisateur
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
        const user = JSON.parse(userStr);
        const navCoins = document.getElementById('nav-coins');
        if (navCoins) navCoins.innerText = user.coins || 0;
    }

    // Gérer les clics sur les boutons de navigation
    const navButtons = container.querySelectorAll('.nav-btn'); 
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            navButtons.forEach(b => b.classList.remove('nav-active'));
            e.currentTarget.classList.add('nav-active');
            const targetPage = e.currentTarget.dataset.target;
            navigateCallback(targetPage);
        });
    });

    // GÉRER LA DÉCONNEXION DE FAÇON DIRECTE (Plus de popup !)
    const btnLogout = container.querySelector('#btn-logout'); 
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            // 1. On vide la session sans poser de question
            sessionStorage.removeItem('currentUser');
            
            // 2. On renvoie vers l'écran de connexion
            window.location.hash = '#login';
            
            // 3. On recharge la page pour tout réinitialiser (retirer la navbar etc)
            window.location.reload();
        });
    }

    if (window.lucide) {
        lucide.createIcons();
    }
}