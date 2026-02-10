export default function RecipeList({ recipes, onSelect }) {
  return (
    <div className="cards">
      {recipes.length === 0 ? (
        <p className="hint">Uygun öneri yok. Malzeme eklemeyi dene 👀</p>
      ) : (
        recipes.map((r, idx) => (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            style={{
              padding: 0,
              border: "none",
              background: "transparent",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <div
              className="recipe staggerItem"
              style={{ animationDelay: `${idx * 120}ms` }}
            >
              <div className="thumb">
                {r.image ? <img src={r.image} alt={r.title} /> : null}
                <div className="thumbOverlay" />
              </div>

              <div className="recipeBody">
                <h3 className="recipeName">{r.title}</h3>
                <p className="meta">
                  {r.time} dk • {r.difficulty}
                </p>
                <p className="meta">
                  Eşleşen: {r.score} / {r.ingredients.length} • Eksik:{" "}
                  {r.missingCount}
                </p>
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  );
}


