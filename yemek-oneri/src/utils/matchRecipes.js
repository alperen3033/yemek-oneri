export function matchRecipes(userIngredients, recipes) {
  if (userIngredients.length === 0) return [];

  const scored = recipes.map((recipe) => {
    const matchedCount = recipe.ingredients.filter((ing) =>
      userIngredients.includes(ing)
    ).length;

    const missingCount = recipe.ingredients.length - matchedCount;

    return {
      ...recipe,
      score: matchedCount,
      missingCount,
    };
  });

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.missingCount - b.missingCount;
    })
    .slice(0, 3);
}
