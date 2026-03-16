const BASE_URL = 'http://localhost:8080/api';

const homeHtml = `
    <div class="max-w-[100rem] mx-auto p-4 lg:p-6 flex flex-col xl:flex-row gap-6 h-[calc(100vh-5rem)]">
        
        <div class="flex-1 flex flex-col rounded-2xl border-2 border-cyan-500/50 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.2)] bg-[#030a14]">
            
            <div id="go-team-header" class="flex-none px-6 py-4 bg-[#030a14] border-b-2 border-cyan-500/50 z-20 shadow-[0_10px_20px_rgba(0,0,0,0.9)] cursor-pointer hover:bg-slate-900 transition-colors group">
                <h2 class="font-orbitron text-2xl font-bold flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <i data-lucide="shield" class="w-6 h-6 text-cyan-400"></i> 
                        <span class="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">MON ÉQUIPE</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-cyan-400 font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        GÉRER <i data-lucide="chevron-right" class="w-5 h-5 animate-pulse"></i>
                    </div>
                </h2>
            </div>
            
            <div id="go-team-pitch" class="flex-1 bg-cyber-pitch relative overflow-y-auto p-6 flex items-center justify-center cursor-pointer group">
                <div class="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors z-0"></div>
                
                <div class="relative w-full max-w-sm mx-auto aspect-[3/4] py-4 z-10 pointer-events-none transition-transform duration-500 group-hover:scale-105">
                    <div class="flex flex-col items-center gap-6 h-full justify-between">
                        <div class="w-20 h-28 border-2 border-yellow-500/50 rounded-xl bg-slate-900/90 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.4)] relative overflow-hidden">
                            <i data-lucide="star" class="w-8 h-8 text-yellow-500 opacity-60 mb-1"></i>
                            <span class="text-[9px] font-orbitron font-bold text-yellow-500 opacity-80 uppercase">Capitaine</span>
                        </div>
                        
                        <div class="flex w-full justify-between px-2">
                            <div class="w-20 h-28 border-2 border-purple-500/50 rounded-xl bg-slate-900/90 flex flex-col items-center justify-center">
                                <i data-lucide="arrow-left" class="w-8 h-8 text-purple-500 opacity-60 mb-1"></i>
                                <span class="text-[9px] font-orbitron font-bold text-purple-500 opacity-80 uppercase">Bras G.</span>
                            </div>
                            <div class="w-20 h-28 border-2 border-blue-500/50 rounded-xl bg-slate-900/90 flex flex-col items-center justify-center">
                                <i data-lucide="crosshair" class="w-8 h-8 text-blue-500 opacity-60 mb-1"></i>
                                <span class="text-[9px] font-orbitron font-bold text-blue-500 opacity-80 uppercase">Centre</span>
                            </div>
                            <div class="w-20 h-28 border-2 border-purple-500/50 rounded-xl bg-slate-900/90 flex flex-col items-center justify-center">
                                <i data-lucide="arrow-right" class="w-8 h-8 text-purple-500 opacity-60 mb-1"></i>
                                <span class="text-[9px] font-orbitron font-bold text-purple-500 opacity-80 uppercase">Bras D.</span>
                            </div>
                        </div>
                        
                        <div class="relative mt-2">
                            <div class="absolute -inset-4 border-t-2 border-x-2 border-pink-500/50 rounded-t-lg opacity-50 shadow-[inset_0_5px_10px_rgba(236,72,153,0.2)]"></div>
                            <div class="w-20 h-28 border-2 border-cyan-500/50 rounded-xl bg-slate-900/90 flex flex-col items-center justify-center relative z-10 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                                <i data-lucide="shield" class="w-8 h-8 text-cyan-500 opacity-60 mb-1"></i>
                                <span class="text-[9px] font-orbitron font-bold text-cyan-500 opacity-80 uppercase">Gardien</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex-none bg-[#030a14] border-t-2 border-cyan-500/50 p-6 z-20">
                <div class="grid grid-cols-4 gap-2 md:gap-4">
                    <div class="text-center">
                        <p class="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Matchs</p>
                        <p id="stat-matches" class="font-orbitron text-2xl md:text-3xl font-black text-white">0</p>
                    </div>
                    <div class="text-center border-l border-slate-700">
                        <p class="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Victoires</p>
                        <p id="stat-wins" class="font-orbitron text-2xl md:text-3xl font-black text-green-400">0</p>
                    </div>
                    <div class="text-center border-l border-slate-700">
                        <p class="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Défaites</p>
                        <p id="stat-losses" class="font-orbitron text-2xl md:text-3xl font-black text-red-400">0</p>
                    </div>
                    <div class="text-center border-l border-slate-700 relative">
                        <p class="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Win Rate</p>
                        <p id="stat-winrate" class="font-orbitron text-2xl md:text-3xl font-black text-purple-400">0%</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-full xl:w-[450px] flex-shrink-0 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-yellow-500/50 overflow-hidden shadow-[0_0_30px_rgba(234,179,8,0.15)] flex flex-col">
            
            <div class="bg-[#030a14] border-b-2 border-yellow-500/50 p-6 flex-none shadow-[0_10px_20px_rgba(0,0,0,0.9)] z-10">
                <h3 class="font-orbitron text-xl font-black text-yellow-400 flex items-center justify-center gap-3 tracking-widest">
                    <i data-lucide="crown" class="w-7 h-7"></i> CLASSEMENT MONDIAL
                </h3>
            </div>
            
            <div class="flex-1 overflow-y-auto p-4 scrollbar-hide">
                <div class="flex flex-col gap-3" id="leaderboard-container">
                    <div class="text-center py-20"><i data-lucide="loader-2" class="w-10 h-10 text-yellow-400 animate-spin mx-auto"></i></div>
                </div>
            </div>
        </div>

    </div>
`;

export async function initHomePage() {
    document.getElementById('app-content').innerHTML = homeHtml;
    lucide.createIcons();

    // ==========================================
    // LOGIQUE DE NAVIGATION CLIC-TERRAIN
    // ==========================================
    const navigateToTeam = () => {
        // On cherche le bouton "Équipe" dans la barre de navigation et on simule un clic dessus
        const teamBtn = document.querySelector('[data-target="team"]');
        if (teamBtn) {
            teamBtn.click();
        }
    };

    // On attache le clic sur l'en-tête "MON ÉQUIPE" et sur le terrain entier
    document.getElementById('go-team-header').addEventListener('click', navigateToTeam);
    document.getElementById('go-team-pitch').addEventListener('click', navigateToTeam);


    let userStr = sessionStorage.getItem('currentUser');
    if (!userStr) return;
    let currentUser = JSON.parse(userStr);

    try {
        // 1. Rafraîchir les stats du joueur connecté
        const userRes = await fetch(`${BASE_URL}/users/${currentUser.id}`);
        if (userRes.ok) {
            const updatedUser = await userRes.json();
            sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
            
            document.getElementById('stat-matches').innerText = updatedUser.matchesPlayed;
            document.getElementById('stat-wins').innerText = updatedUser.wins;
            document.getElementById('stat-losses').innerText = updatedUser.losses;
            
            let winrate = 0;
            if (updatedUser.matchesPlayed > 0) {
                winrate = Math.round((updatedUser.wins / updatedUser.matchesPlayed) * 100);
            }
            document.getElementById('stat-winrate').innerText = `${winrate}%`;
            document.getElementById('nav-coins').innerText = updatedUser.coins;
        }

        // 2. Charger le classement mondial
        const leadRes = await fetch(`${BASE_URL}/users/leaderboard`);
        if (leadRes.ok) {
            let leaderboard = await leadRes.json();
            const container = document.getElementById('leaderboard-container');
            
            if (leaderboard.length === 0) {
                container.innerHTML = `<div class="text-center p-8 text-gray-500 font-orbitron font-bold">Aucun match joué sur le serveur.</div>`;
                return;
            }

            // SÉCURITÉ : On force le tri décroissant
            leaderboard.sort((a, b) => b.wins - a.wins);

            container.innerHTML = leaderboard.map((player, index) => {
                let badge = `<span class="text-gray-500 font-black text-2xl">#${index + 1}</span>`;
                if (index === 0) badge = `<i data-lucide="crown" class="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] mx-auto"></i>`;
                if (index === 1) badge = `<i data-lucide="medal" class="w-7 h-7 text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.8)] mx-auto"></i>`;
                if (index === 2) badge = `<i data-lucide="medal" class="w-7 h-7 text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.8)] mx-auto"></i>`;

                let wr = 0;
                if (player.matchesPlayed > 0) wr = Math.round((player.wins / player.matchesPlayed) * 100);
                
                const isMe = player.id === currentUser.id ? 'bg-slate-800/80 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] scale-[1.02]' : 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50';
                const nameColor = player.id === currentUser.id ? 'text-cyan-400' : 'text-white';

                return `
                    <div class="flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 ${isMe}">
                        <div class="flex-none w-12 text-center">${badge}</div>
                        <div class="flex-1 truncate">
                            <p class="font-orbitron font-bold text-lg ${nameColor} truncate">
                                ${player.username} ${player.id === currentUser.id ? '<span class="text-xs text-cyan-500 ml-1">(Toi)</span>' : ''}
                            </p>
                            <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">${player.matchesPlayed} Matchs Joués</p>
                        </div>
                        <div class="flex-none text-right">
                            <p class="font-orbitron font-black text-xl text-green-400">${player.wins} <span class="text-sm text-gray-500">V</span></p>
                            <p class="text-xs text-purple-400 font-bold">${wr}% WR</p>
                        </div>
                    </div>
                `;
            }).join('');
            
            lucide.createIcons();
        }
    } catch (error) {
        console.error("Erreur de chargement de l'accueil:", error);
    }
}