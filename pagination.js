// pagination.js - JUSTE pour la page d'accueil
const recettesParPage = 6;

function afficherPageAccueil(page = 1) {
    const toutesLesCartes = document.querySelectorAll('.card');
    const totalPages = Math.ceil(toutesLesCartes.length / recettesParPage);
    
    // Cache toutes les cartes
    toutesLesCartes.forEach(carte => {
        carte.style.display = 'none';
    });
    
    // Affiche seulement les cartes de la page actuelle
    const debut = (page - 1) * recettesParPage;
    const fin = debut + recettesParPage;
    
    for (let i = debut; i < fin && i < toutesLesCartes.length; i++) {
        toutesLesCartes[i].style.display = 'block';
    }
    
    // Met à jour la pagination
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <div class="page-number ${i === page ? 'active' : ''}" 
                 onclick="afficherPageAccueil(${i})">
                ${i}
            </div>
        `;
    }
}

// Au chargement de la page d'accueil
if (document.querySelector('.cards-container')) {
    afficherPageAccueil(1);
}
