/**
 * Logique pour faire défiler la page automatiquement quand on approche des bords
 */
function autoScrollOnDrag(e) {
    const edgeSize = 100; // Zone de 100 pixels en haut et en bas qui déclenche le scroll
    const scrollSpeed = 20; // Vitesse du scroll

    if (e.clientY < edgeSize) {
        // La souris est tout en haut, on remonte
        window.scrollBy(0, -scrollSpeed);
    } else if (window.innerHeight - e.clientY < edgeSize) {
        // La souris est tout en bas, on descend
        window.scrollBy(0, scrollSpeed);
    }
}

export function initDragAndDrop(onDropCallback) {
    const draggables = document.querySelectorAll('.draggable');
    const slots = document.querySelectorAll('.card-slot');

    // 1. Sur la carte qu'on attrape
    draggables.forEach(card => {
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', card.dataset.cardId);
            
            setTimeout(() => card.classList.add('opacity-50'), 0);

            // ACTIVER LE SCROLL AUTOMATIQUE
            document.addEventListener('dragover', autoScrollOnDrag);
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('opacity-50');
            
            // DÉSACTIVER LE SCROLL AUTOMATIQUE quand on lâche
            document.removeEventListener('dragover', autoScrollOnDrag);
        });
    });

    // 2. Sur les emplacements du terrain
    slots.forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault(); // Nécessaire pour autoriser le drop
            e.dataTransfer.dropEffect = 'move';
            
            // Effet visuel
            slot.classList.add('border-cyan-400', 'bg-cyan-500/10');
            slot.classList.remove('border-dashed', 'bg-slate-800/50');
        });

        slot.addEventListener('dragenter', (e) => {
            e.preventDefault();
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('border-cyan-400', 'bg-cyan-500/10');
            if (!slot.querySelector('.card-base')) {
                slot.classList.add('border-dashed', 'bg-slate-800/50');
            }
        });

        // 3. Quand on relâche le clic souris
        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('border-cyan-400', 'bg-cyan-500/10');
            
            const cardId = e.dataTransfer.getData('text/plain');
            const position = slot.dataset.position;

            if (cardId) {
                onDropCallback(cardId, position, slot);
            }
        });
    });
}