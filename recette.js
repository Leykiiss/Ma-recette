// ===== RECETTES DE BASE =====
const recettesBase = [
    {
        id:"crepes", 
        titre: "Crepes", 
        ingredients:["100g farine","2 oeufs","200ml lait"],
        preparation: "/",
        cuisson:"2min chaque coté",
    },
    {
        id:"muffins", 
        titre:"Muffins", 
        ingredients:["100g farine","100g sucre","150g pépite chocolat","10ml huile"],
        preparation:"/",
        cuisson: "30min à 150°",
    },
    {
        id:"gauffres",
        titre:"Gauffres",
        ingredients:["300g farine","90g beurre","40cl lait","1 sachet levure","1 sachet sucre vanille","50g sucre","2 oeufs"],
        preparation:"mélanger d'abord la farine et la levure. Puis rajouter progressivement le lait. faire fondre le beurre et le rajoute et par la suite ajouter les oeufs broullier",
        cuisson:"mettre la machine à temperature max et atttendre entre 5 à 10min avant de retirer"
    }
];

// ===== FONCTION POUR CHARGER LA RECETTE =====
async function chargerRecette() {
    const params = new URLSearchParams(window.location.search);
    const recetteId = params.get('id');

    console.log("🔍 ID recherché:", recetteId);

    if (!recetteId) {
        console.log("Aucun ID de recette fourni");
        return;
    }

    // 1. D'abord chercher dans les recettes de base
    const recetteBase = recettesBase.find(r => r.id === recetteId);
    if (recetteBase) {
        console.log("✅ Trouvée dans base locale");
        afficherRecette(recetteBase);
        return;
    }

    // 2. Ensuite chercher dans Supabase
    try {
        if (typeof window.supabase !== 'undefined') {
            console.log("🔍 Recherche dans Supabase pour ID:", recetteId);
            
            // TEST : Vérifier d'abord s'il y a des recettes
            const { data: toutesRecettes, error: errorAll } = await window.supabase
                .from('recettes')
                .select('*');
            
            console.log("📋 Toutes les recettes dans Supabase:", toutesRecettes);
            
            // Recherche spécifique - PREMIÈRE TENTATIVE
            const { data: recette, error } = await window.supabase
                .from('recettes')
                .select('*')
                .eq('id', recetteId)
                .single();

            console.log("Réponse Supabase (1ère tentative):", { data: recette, error: error });

            if (error) {
                console.error("❌ Erreur Supabase détaillée:", error);
                
                // DEUXIÈME TENTATIVE - sans .single()
                const { data: recettes, error: errorMultiple } = await window.supabase
                    .from('recettes')
                    .select('*')
                    .eq('id', recetteId);

                console.log("Réponse Supabase (2ème tentative):", { data: recettes, error: errorMultiple });
                
                if (!errorMultiple && recettes && recettes.length > 0) {
                    console.log("✅ Recette trouvée (2ème tentative):", recettes[0]);
                    afficherRecette(recettes[0]);
                    return;
                }
            } 
            
            if (recette) {
                console.log("✅ Recette trouvée dans Supabase:", recette);
                afficherRecette(recette);
                return;
            } else {
                console.log("❌ Aucune recette trouvée avec cet ID");
            }
        } else {
            console.log("❌ Supabase non configuré");
        }
    } catch (error) {
        console.error('💥 Erreur générale:', error);
    }

    console.log("❌ Recette non trouvée");
}

// ===== FONCTION POUR AFFICHER LA RECETTE =====
function afficherRecette(recette) {
    console.log("📝 Affichage de la recette:", recette);
    
    // Titre
    document.getElementById("titre").innerText = recette.titre || "Titre manquant";
    
    // Ingrédients (gère les tableaux ET les strings)
    let ingredientsArray = [];
    if (Array.isArray(recette.ingredients)) {
        ingredientsArray = recette.ingredients;
    } else if (typeof recette.ingredients === 'string') {
        ingredientsArray = recette.ingredients.split('\n').filter(i => i.trim() !== '');
    } else {
        console.warn("Format d'ingrédients inattendu:", recette.ingredients);
    }
    document.getElementById("ingredients").innerHTML = ingredientsArray.map(i => `<li>${i}</li>`).join('');
    
    // Préparation et cuisson
    document.getElementById("preparation").innerText = "• " + (recette.preparation || "/");
    document.getElementById("cuisson").innerText = "• " + (recette.cuisson || "/");
}

// ===== DÉMARRAGE =====
document.addEventListener('DOMContentLoaded', chargerRecette);
