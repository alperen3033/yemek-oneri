export default function RecipeModal({ recipe, onClose, userIngredients }) {
  if (!recipe) return null;

  const have = recipe.ingredients.filter((x) => userIngredients.includes(x));
  const missing = recipe.ingredients.filter((x) => !userIngredients.includes(x));

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalPanel fadeIn" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modalHeader">
          <div>
            <div className="modalTitle">{recipe.title}</div>
            <div className="modalSub">
              {recipe.time} dk • {recipe.difficulty}
            </div>
          </div>

          <button className="btn" onClick={onClose} title="Kapat">
            ✕
          </button>
        </div>

        {/* IMAGE */}
        {recipe.image ? (
          <img className="modalImage" src={recipe.image} alt={recipe.title} />
        ) : null}

        {/* CONTENT */}
        <div className="modalBody">
          <div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Sende olanlar</div>
            <div className="chips">
              {have.length === 0 ? (
                <span className="hint">Hiçbiri yok</span>
              ) : (
                have.map((x) => (
                  <span className="chip" key={x}>
                    {x}
                  </span>
                ))
              )}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Eksikler</div>
            {missing.length === 0 ? (
              <div style={{ opacity: 0.85 }}>Her şey tamam ✅</div>
            ) : (
              <div className="chips">
                {missing.map((x) => (
                  <span className="chip" key={x}>
                    {x}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontWeight: 800, marginBottom: 10 }}>Tarif Adımları</div>
            <ol className="stepsListModal">
              {(recipe.steps || []).map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
