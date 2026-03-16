import { authApi } from '../api/authApi.js';

const loginHtml = `
    <div class="h-screen w-full flex flex-col md:flex-row relative overflow-hidden z-10">
        
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 vs-badge w-24 h-24 md:w-32 md:h-32 flex items-center justify-center hidden md:flex">
            <span class="font-orbitron font-black text-4xl md:text-5xl text-white italic">VS</span>
        </div>

        <div class="flex-1 login-split-left flex items-center justify-center p-8 relative group border-b-4 md:border-b-0 md:border-r-4 border-cyan-500 shadow-[0_0_50px_rgba(0,240,255,0.3)]">
            
            <div class="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-500 pointer-events-none"></div>

            <div class="relative z-10 w-full max-w-sm bg-slate-900/80 backdrop-blur-md p-8 clip-path-hud border border-cyan-500/50 transform transition-transform duration-500 group-hover:scale-105">
                <h1 class="font-orbitron text-4xl font-black mb-2 text-cyan-400 italic">RETOUR<br>AU JEU</h1>
                <p class="text-gray-300 mb-8 font-bold tracking-widest text-sm">CONNEXION AU SERVEUR</p>
                
                <form id="login-form" class="space-y-5">
                    <div>
                        <label class="block text-xs font-bold text-cyan-400 mb-2 font-orbitron tracking-widest">PSEUDO</label>
                        <input type="text" id="login-username" placeholder="VOTRE NOM" required
                            class="w-full bg-slate-950/80 border border-cyan-500/30 rounded-none px-4 py-3 text-white focus:outline-none focus:border-cyan-400 font-bold uppercase">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-cyan-400 mb-2 font-orbitron tracking-widest">MOT DE PASSE</label>
                        <input type="password" id="login-password" placeholder="••••••••" required
                            class="w-full bg-slate-950/80 border border-cyan-500/30 rounded-none px-4 py-3 text-white focus:outline-none focus:border-cyan-400 font-bold uppercase">
                    </div>
                    <button type="submit" id="btn-login" class="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 px-6 font-orbitron text-xl italic tracking-widest transition-all mt-4 border-2 border-transparent hover:border-white shadow-[0_0_20px_rgba(0,240,255,0.6)]">
                        START
                    </button>
                </form>
            </div>
        </div>

        <div class="flex-1 login-split-right flex items-center justify-center p-8 relative group border-t-4 md:border-t-0 md:border-l-4 border-pink-500 shadow-[0_0_50px_rgba(255,0,60,0.3)]">
            
            <div class="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-500 pointer-events-none"></div>

            <div class="relative z-10 w-full max-w-sm bg-slate-900/80 backdrop-blur-md p-8 clip-path-hud border border-pink-500/50 transform transition-transform duration-500 group-hover:scale-105">
                <h1 class="font-orbitron text-4xl font-black mb-2 text-pink-500 italic">NOUVEAU<br>CHALLENGER</h1>
                <p class="text-gray-300 mb-8 font-bold tracking-widest text-sm">CRÉATION D'ÉQUIPE</p>
                
                <form id="register-form" class="space-y-5">
                    <div>
                        <label class="block text-xs font-bold text-pink-400 mb-2 font-orbitron tracking-widest">PSEUDO</label>
                        <input type="text" id="register-username" placeholder="VOTRE NOM" required
                            class="w-full bg-slate-950/80 border border-pink-500/30 rounded-none px-4 py-3 text-white focus:outline-none focus:border-pink-400 font-bold uppercase">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-pink-400 mb-2 font-orbitron tracking-widest">MOT DE PASSE</label>
                        <input type="password" id="register-password" placeholder="••••••••" required
                            class="w-full bg-slate-950/80 border border-pink-500/30 rounded-none px-4 py-3 text-white focus:outline-none focus:border-pink-400 font-bold uppercase">
                    </div>
                    <button type="submit" id="btn-register" class="w-full bg-pink-600 hover:bg-pink-500 text-white font-black py-4 px-6 font-orbitron text-xl italic tracking-widest transition-all mt-4 border-2 border-transparent hover:border-white shadow-[0_0_20px_rgba(255,0,60,0.6)]">
                        REJOINDRE
                    </button>
                </form>
            </div>
        </div>

    </div>
`;

export function initLoginPage(navigateCallback) {
    document.getElementById('navbar-container').classList.add('hidden');
    
    const appContent = document.getElementById('app-content');
    appContent.innerHTML = loginHtml;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btn-login');
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            btn.innerText = "LOADING...";
            btn.disabled = true;

            const userData = await authApi.login(username, password);
            sessionStorage.setItem('currentUser', JSON.stringify(userData));
            
            navigateCallback('home'); 
            
        } catch (error) {
            alert(error.message);
        } finally {
            btn.innerText = "START";
            btn.disabled = false;
        }
    });

    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btn-register');
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        try {
            btn.innerText = "LOADING...";
            btn.disabled = true;

            const userData = await authApi.register(username, password);
            sessionStorage.setItem('currentUser', JSON.stringify(userData));
            
            navigateCallback('home');
            
        } catch (error) {
            alert(error.message);
        } finally {
            btn.innerText = "REJOINDRE";
            btn.disabled = false;
        }
    });
}