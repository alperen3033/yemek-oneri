const API_BASE_URL = "http://127.0.0.1:8000";

export async function addFavoriteRecipe(recipe, token) {
  const response = await fetch(`${API_BASE_URL}/api/favorites/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      recipe_title: recipe.title,
      recipe_data: recipe,
      source: "openai",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Favoriye eklenemedi.");
  }

  return data;
}

export async function getFavoriteRecipes(token) {
  const response = await fetch(`${API_BASE_URL}/api/favorites/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Favoriler alınamadı.");
  }

  return data;
}