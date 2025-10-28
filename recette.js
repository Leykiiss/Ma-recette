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

    if (!recetteId) {
        console.log("Aucun ID de recette fourni");
        return;
    }

    // 1. D'abord chercher dans les recettes de base
    const recetteBase = recettesBase.find(r => r.id === recetteId);
    if (recetteBase) {
        afficherRecette(recetteBase);
        return;
    }

    // 2. Ensuite chercher dans Supabase (si configuré)
    try {
        if (typeof window.supabase !== 'undefined') {
            const { data: recette, error } = await window.supabase
                .from('recettes')
                .select('*')
                .eq('id', recetteId)
                .single();

            if (!error && recette) {
                afficherRecette(recette);
                return;
            }
        }
    } catch (error) {
        console.log('Supabase non configuré ou erreur');
    }

    // 3. Si aucune recette trouvée
    console.log("Recette non trouvée");
}

// ===== FONCTION POUR AFFICHER LA RECETTE =====
function afficherRecette(recette) {
    document.getElementById("titre").innerText = recette.titre;
    document.getElementById("ingredients").innerHTML = recette.ingredients.map(i => `<li>${i}</li>`).join('');
    document.getElementById("preparation").innerText = "• " + recette.preparation;
    document.getElementById("cuisson").innerText = "• " + recette.cuisson;
}

// ===== DÉMARRAGE =====
document.addEventListener('DOMContentLoaded', chargerRecette);
