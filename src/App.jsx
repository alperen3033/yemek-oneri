import { useEffect, useState } from "react";
import "./App.css";

import IngredientInput from "./components/IngredientInput";
import IngredientChips from "./components/IngredientChips";
import RecipeList from "./components/RecipeList";
import RecipeModal from "./components/RecipeModal";
import LoginForm from "./components/LoginForm";

import { suggestRecipes } from "./services/recipeApi";
import { loginUser, fetchMe } from "./api/authApi";

function normalizeToken(s) {
  return s.trim().toLowerCase();
}

export default function App() {
  // auth
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // input + ingredient list
  const [ingredientsText, setIngredientsText] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [lastAdded, setLastAdded] = useState(null);

  // recipes
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // modal
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
    setError("");

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

  const handleClearAll = () => {
    setIngredients([]);
    setIngredientsText("");
    setDisplayedRecipes([]);
    setHasSearched(false);
    setSelectedRecipe(null);
    setIsLoading(false);
    setError("");
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

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div className="pill">🍅 {currentUser.username} • giriş yaptı</div>
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

            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn btnPrimary" onClick={handleSuggest} disabled={isLoading}>
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
                  Tarifler karıştırılıyor<span className="dots"></span>
                </div>
              </div>
            ) : error ? (
              <p className="hint">{error}</p>
            ) : !hasSearched ? (
              <p className="hint">
                Malzemeleri ekle, <b>Öner</b>’e basınca kartlar burada çıkacak.
              </p>
            ) : (
              <RecipeList recipes={displayedRecipes} onSelect={setSelectedRecipe} />
            )}
          </div>
        </div>

        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          userIngredients={ingredients}
        />
      </div>
    </div>
  );
}