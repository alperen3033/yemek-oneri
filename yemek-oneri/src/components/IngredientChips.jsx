export default function IngredientChips({ items, onRemove, lastAdded }) {
  return (
    <div className="chips">
      {items.length === 0 ? (
        <span className="hint">Henüz malzeme yok. Bir şeyler yaz 🔥</span>
      ) : (
        items.map((ing) => (
          <span
            className={`chip ${lastAdded === ing ? "chipPop" : ""}`}
            key={ing}
          >
            {ing}
            <button
              className="chipX"
              aria-label={`${ing} sil`}
              onClick={() => onRemove(ing)}
              title="Sil"
            >
              ×
            </button>
          </span>
        ))
      )}
    </div>
  );
}

