import { useEffect, useState } from "react";
import "./App.css";

import IngredientInput from "./components/IngredientInput";
import IngredientChips from "./components/IngredientChips";
import RecipeList from "./components/RecipeList";
import RecipeModal from "./components/RecipeModal";
import LoginForm from "./components/LoginForm";

import { suggestRecipes } from "./services/recipeApi";
import { loginUser, fetchMe } from "./api/authApi";
import {
  addFavoriteRecipe,
  getFavoriteRecipes,
  deleteFavoriteRecipe,
} from "./api/favoriteApi";

function normalizeToken(s) {
  return s.trim().toLowerCase();
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");

  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState("");
  const [deletingFavoriteId, setDeletingFavoriteId] = useState(null);

  const [ingredientsText, setIngredientsText] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [lastAdded, setLastAdded] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    async function loadUser() {
      if (!token) return;

      try {
        const user = await fetchMe(token);
        setCurrentUser(user);
      } catch (error) {
        console.error("fetchMe error:", error);
        localStorage.removeItem("accessToken");
        setToken("");
        setCurrentUser(null);
      }
    }

    loadUser();
  }, [token]);

  const handleLogin = async (username, password) => {
    setAuthLoading(true);
    setAuthError("");

    try {
      const data = await loginUser(username, password);
      localStorage.setItem("accessToken", data.access);
      setToken(data.access);

      const user = await fetchMe(data.access);
      setCurrentUser(user);
    } catch (error) {
      console.error("login error:", error);
      setAuthError(error.message || "Giriş başarısız");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setToken("");
    setCurrentUser(null);
    setSelectedRecipe(null);
    setFavoriteMessage("");
    setFavorites([]);
    setShowFavorites(false);
  };

  const addMany = (raw) => {
    const tokens = raw
      .split(",")
      .map((t) => normalizeToken(t))
      .filter(Boolean);

    if (tokens.length === 0) return;

    setIngredients((prev) => {
      const set = new Set(prev);
      tokens.forEach((t) => set.add(t));
      return Array.from(set);
    });

    const last = tokens[tokens.length - 1];
    setLastAdded(last);
    window.setTimeout(() => setLastAdded(null), 200);
  };

  const addFromInput = () => {
    addMany(ingredientsText);
    setIngredientsText("");
  };

  const removeIngredient = (name) => {
    setIngredients((prev) => prev.filter((x) => x !== name));
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFromInput();
    }
  };

  const handleSuggest = async () => {
    setSelectedRecipe(null);
    setFavoriteMessage("");
    setError("");
    setShowFavorites(false);

    if (ingredients.length === 0) {
      setHasSearched(false);
      setDisplayedRecipes([]);
      setError("Öneri almak için önce en az bir malzeme ekleyin.");
      return;
    }

    setHasSearched(true);
    setIsLoading(true);
    setDisplayedRecipes([]);

    try {
      const recipes = await suggestRecipes(ingredients);
      setDisplayedRecipes(recipes);
    } catch (error) {
      console.error("API error:", error);
      setError(error.message || "Tarifler alınırken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFavorite = async (recipe) => {
    setFavoriteLoading(true);
    setFavoriteMessage("");

    try {
      await addFavoriteRecipe(recipe, token);
      setFavoriteMessage("Favorilere eklendi ✅");

      if (showFavorites) {
        const data = await getFavoriteRecipes(token);
        setFavorites(data);
      }
    } catch (error) {
      console.error("favorite error:", error);
      setFavoriteMessage(error.message || "Favoriye eklenemedi.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleShowFavorites = async () => {
    setShowFavorites(true);
    setFavoritesLoading(true);
    setFavoritesError("");
    setSelectedRecipe(null);

    try {
      const data = await getFavoriteRecipes(token);
      setFavorites(data);
    } catch (error) {
      console.error("favorites error:", error);
      setFavoritesError(error.message || "Favoriler alınamadı.");
    } finally {
      setFavoritesLoading(false);
    }
  };

  const handleDeleteFavorite = async (favoriteId) => {
    setDeletingFavoriteId(favoriteId);
    setFavoritesError("");

    try {
      await deleteFavoriteRecipe(favoriteId, token);
      setFavorites((prev) => prev.filter((favorite) => favorite.id !== favoriteId));
    } catch (error) {
      console.error("delete favorite error:", error);
      setFavoritesError(error.message || "Favoriden çıkarılamadı.");
    } finally {
      setDeletingFavoriteId(null);
    }
  };

  const handleBackToSuggestions = () => {
    setShowFavorites(false);
  };

  const handleClearAll = () => {
    setIngredients([]);
    setIngredientsText("");
    setDisplayedRecipes([]);
    setHasSearched(false);
    setSelectedRecipe(null);
    setIsLoading(false);
    setError("");
    setFavoriteMessage("");
    setShowFavorites(false);
  };

  if (!currentUser) {
    return (
      <div className="page">
        <div className="container">
          <div className="topbar">
            <div className="brand">
              <div className="logo">🍳</div>
              <div className="brandName">
                <b>Ne Pişirsem</b>
                <span>Önce giriş yap, sonra mutfağa dal</span>
              </div>
            </div>
          </div>

          <LoginForm
            onLogin={handleLogin}
            isLoading={authLoading}
            error={authError}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="topbar">
          <div className="brand">
            <div className="logo">🍳</div>
            <div className="brandName">
              <b>Ne Pişirsem</b>
              <span>Malzeme → 3 öneri → tarif</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div className="pill">🍅 {currentUser.username} • giriş yaptı</div>

            <button className="btn" onClick={handleShowFavorites}>
              Favorilerim
            </button>

            <button className="btn" onClick={handleLogout}>
              Çıkış Yap
            </button>
          </div>
        </div>

        <div className="hero">
          <h1 className="heroTitle">Ne Pişirsem?</h1>
          <p className="heroSub">
            Malzemeleri gir, <b>Öner</b>’e bas, sistem düşünsün… 3 öneri gelsin.
          </p>
        </div>

        {showFavorites ? (
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <h2 className="sectionTitle">
                Favorilerim{" "}
                <span className="tag">{favorites.length} tarif</span>
              </h2>

              <button className="btn" onClick={handleBackToSuggestions}>
                Önerilere Dön
              </button>
            </div>

            {favoritesLoading ? (
              <p className="hint">Favoriler yükleniyor...</p>
            ) : favoritesError ? (
              <p className="hint">{favoritesError}</p>
            ) : favorites.length === 0 ? (
              <p className="hint">Henüz favori tarif yok.</p>
            ) : (
              <div className="cards">
                {favorites.map((favorite) => (
                  <div className="recipe" key={favorite.id}>
                    <button
                      onClick={() => {
                        setSelectedRecipe(favorite.recipe_data);
                        setFavoriteMessage("");
                      }}
                      style={{
                        padding: 0,
                        border: "none",
                        background: "transparent",
                        textAlign: "left",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <div className="recipeBody">
                        <h3 className="recipeName">{favorite.recipe_title}</h3>

                        <p className="meta">
                          {favorite.recipe_data?.time} dk •{" "}
                          {favorite.recipe_data?.difficulty}
                        </p>

                        <p className="meta">Kaynak: {favorite.source}</p>
                      </div>
                    </button>

                    <div style={{ padding: "0 16px 16px" }}>
                      <button
                        className="btn"
                        onClick={() => handleDeleteFavorite(favorite.id)}
                        disabled={deletingFavoriteId === favorite.id}
                      >
                        {deletingFavoriteId === favorite.id
                          ? "Çıkarılıyor..."
                          : "Favoriden Çıkar"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid">
            <div className="card">
              <h2 className="sectionTitle">
                Malzemeler <span className="tag">hazırla</span>
              </h2>

              <IngredientInput
                value={ingredientsText}
                onChange={setIngredientsText}
                onAdd={addFromInput}
                onClear={handleClearAll}
                onKeyDown={onKeyDown}
              />

              <IngredientChips
                items={ingredients}
                onRemove={removeIngredient}
                lastAdded={lastAdded}
              />

              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <button
                  className="btn btnPrimary"
                  onClick={handleSuggest}
                  disabled={isLoading}
                >
                  Öner
                </button>

                <button className="btn" onClick={handleClearAll}>
                  Baştan
                </button>
              </div>
            </div>

            <div className="card">
              <h2 className="sectionTitle">
                Öneriler <span className="tag">3 tarif</span>
              </h2>

              {isLoading ? (
                <div className="loaderWrap fadeIn">
                  <div className="spinner" />
                  <div className="typeLine">
                    Tarifler karıştırılıyor
                    <span className="dots"></span>
                  </div>
                </div>
              ) : error ? (
                <p className="hint">{error}</p>
              ) : !hasSearched ? (
                <p className="hint">
                  Malzemeleri ekle, <b>Öner</b>’e basınca kartlar burada
                  çıkacak.
                </p>
              ) : (
                <RecipeList
                  recipes={displayedRecipes}
                  onSelect={setSelectedRecipe}
                />
              )}
            </div>
          </div>
        )}

        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => {
            setSelectedRecipe(null);
            setFavoriteMessage("");
          }}
          userIngredients={ingredients}
          onAddFavorite={handleAddFavorite}
          favoriteLoading={favoriteLoading}
          favoriteMessage={favoriteMessage}
        />
      </div>
    </div>
  );
}