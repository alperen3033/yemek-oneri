const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL tanımlı değil.");
}

function buildUrl(path) {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL tanımlı değil.");
  }

  return new URL(path, API_BASE_URL).toString();
}

export async function suggestRecipes(ingredients) {
  const response = await fetch(buildUrl("/api/recipes/suggest/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ingredients }),
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.detail || "Tarifler alınırken bir hata oluştu.");
  }

  return Array.isArray(data?.recipes) ? data.recipes : [];
}
