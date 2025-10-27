// recherche.js - Version corrigée
function initialiserRecherche() {
    const inputRecherche = document.getElementById('barre-recherche');
    
    inputRecherche.addEventListener('input', function(e) {
        const termeRecherche = e.target.value.toLowerCase().trim();
        const toutesLesCartes = document.querySelectorAll('.card');
        
        console.log('Recherche:', termeRecherche); // Pour debug
        
        if (termeRecherche === '') {
            // Si recherche vide, affiche tout
            toutesLesCartes.forEach(carte => {
                carte.style.display = 'block';
            });
        } else {
            // Recherche active
            toutesLesCartes.forEach(carte => {
                const titre = carte.querySelector('h2').textContent.toLowerCase();
                
                if (titre.includes(termeRecherche)) {
                    carte.style.display = 'block';
                } else {
                    carte.style.display = 'none';
                }
            });
        }
        
        // Met à jour la pagination si elle existe
        if (typeof afficherPageAccueil === 'function') {
            //  afficherPageAccueil(1);
        }
    });
}

// Attend que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('Recherche initialisée'); // Pour debug
    initialiserRecherche();
});