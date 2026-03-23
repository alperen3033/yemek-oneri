import { useMemo, useRef, useState } from "react";
import "./App.css";


import IngredientInput from "./components/IngredientInput";
import IngredientChips from "./components/IngredientChips";
import RecipeList from "./components/RecipeList";
import RecipeModal from "./components/RecipeModal";

function normalizeToken(s) {
  return s.trim().toLowerCase();
}

export default function App() {
  // input + ingredient list
  const [ingredientsText, setIngredientsText] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [lastAdded, setLastAdded] = useState(null);

  // demo flow
  const [isLoading, setIsLoading] = useState(false);
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // modal
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // scroll target
  const resultsRef = useRef(null);

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

    // chip pop animation (last token)
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

  // compute best 3 (not shown immediately)

  const handleSuggest = async () => {
    setHasSearched(true);
    setSelectedRecipe(null);

    if (ingredients.length === 0) {
      setDisplayedRecipes([]);
      return;
    }

    setIsLoading(true);
    setDisplayedRecipes([]);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/recipes/suggest/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }),
      });

      const data = await res.json();
      setDisplayedRecipes(data.recipes);
    } catch (error) {
      console.error("API error:", error);
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
  };

  return (
    <div className="page">
      <div className="container">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="brand">
            <div className="logo">🍳</div>
            <div className="brandName">
              <b>Ne Pişirsem</b>
              <span>Malzeme → 3 öneri → tarif</span>
            </div>
          </div>
          <div className="pill">🍅 Sunum modu • v0.1</div>
        </div>

        {/* HERO */}
        <div className="hero">
          <h1 className="heroTitle">Ne Pişirsem?</h1>
          <p className="heroSub">
            Malzemeleri gir, <b>Öner</b>’e bas, sistem düşünsün… 3 öneri gelsin.
          </p>
        </div>

        <div className="grid">
          {/* LEFT */}
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
              <button className="btn btnPrimary" onClick={handleSuggest}>
                Öner
              </button>
              <button className="btn" onClick={handleClearAll}>
                Baştan
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="card" ref={resultsRef}>
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
            ) : !hasSearched ? (
              <p className="hint">
                Malzemeleri ekle, <b>Öner</b>’e basınca kartlar burada çıkacak.
              </p>
            ) : (
              <RecipeList recipes={displayedRecipes} onSelect={setSelectedRecipe} />
            )}
          </div>
        </div>

        {/* MODAL */}
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          userIngredients={ingredients}
        />
      </div>
    </div>
  );
}
