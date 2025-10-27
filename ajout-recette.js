// ===== GESTION DU FORMULAIRE =====
function ouvrirFormulaire() {
    document.querySelector('.formulaire-overlay').style.display = 'flex';
}

function fermerFormulaire() {
    document.querySelector('.formulaire-overlay').style.display = 'none';
    resetFormulaire();
}

function resetFormulaire() {
    document.getElementById('nouveauTitre').value = '';
    document.getElementById('nouveauxIngredients').value = '';
    document.getElementById('nouvellePreparation').value = '';
    document.getElementById('nouvelleCuisson').value = '';
    document.getElementById('nouvelleImage').value = '';
}

// ===== AJOUT D'UNE RECETTE AVEC SUPABASE =====
async function ajouterRecette() {
    const titre = document.getElementById('nouveauTitre').value;
    const ingredients = document.getElementById('nouveauxIngredients').value.split('\n').filter(i => i.trim() !== '');
    const preparation = document.getElementById('nouvellePreparation').value || '/';
    const cuisson = document.getElementById('nouvelleCuisson').value || '/';
    const imageFile = document.getElementById('nouvelleImage').files[0];

    if (!titre) {
        alert('Le titre est obligatoire !');
        return;
    }

    try {
        let imageUrl = 'img/muffins.jpeg'; // Image par défaut

        // Si une image est uploadée
        if (imageFile) {
            const fileName = `${Date.now()}_${imageFile.name}`;
            
            // Upload l'image vers Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('recettes-images')
                .upload(fileName, imageFile);

            if (uploadError) throw uploadError;

            // Récupère l'URL publique de l'image
            const { data: urlData } = supabase.storage
                .from('recettes-images')
                .getPublicUrl(fileName);

            imageUrl = urlData.publicUrl;
        }

        // Ajoute la recette à la base de données
        const { data, error } = await supabase
            .from('recettes')
            .insert([
                {
                    titre: titre,
                    ingredients: ingredients,
                    preparation: preparation,
                    cuisson: cuisson,
                    image_url: imageUrl
                }
            ])
            .select();

        if (error) throw error;

        // Crée la carte immédiatement
        creerCardRecette(data[0]);
        
        fermerFormulaire();
        alert('Recette créée ! 🎉');

    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la création de la recette');
    }
}

// ===== AFFICHER LES RECETTES =====
async function chargerEtAfficherRecettes() {
    try {
        const { data: recettes, error } = await supabase
            .from('recettes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Affiche toutes les recettes
        const cardsContainer = document.querySelector('.cards-container');
        cardsContainer.innerHTML = ''; // Vide le conteneur

        recettes.forEach(recette => {
            creerCardRecette(recette);
        });

    } catch (error) {
        console.error('Erreur:', error);
    }
}

// ===== CRÉER UNE CARTE =====
function creerCardRecette(recette) {
    const cardsContainer = document.querySelector('.cards-container');
    
    const nouvelleCard = `
        <a href="recette.html?id=${recette.id}" class="card">
            <div class="img-container">
                <img src="${recette.image_url}" alt="${recette.titre}">
            </div>
            <div class="text-container">
                <h2>${recette.titre}</h2>
                <h3>une envie de ${recette.titre.toLowerCase()} ? clique ici</h3>
            </div>
        </a>
    `;
    
    cardsContainer.innerHTML += nouvelleCard;
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Événements du formulaire
    document.querySelector('.boutton-ajout').addEventListener('click', ouvrirFormulaire);
    document.querySelector('.formulaire-overlay').addEventListener('click', function(e) {
        if (e.target === this) fermerFormulaire();
    });

    // Charge les recettes au démarrage
    if (document.querySelector('.cards-container')) {
        chargerEtAfficherRecettes();
    }
});