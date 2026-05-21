const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL tanımlı değil.");
}

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

export async function deleteFavoriteRecipe(favoriteId, token) {
  const response = await fetch(`${API_BASE_URL}/api/favorites/${favoriteId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let message = "Favoriden çıkarılamadı.";

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // DELETE 204 response has no body
    }

    throw new Error(message);
  }

  return true;
}