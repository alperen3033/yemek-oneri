export default function IngredientInput({
  value,
  onChange,
  onAdd,
  onClear,
  onKeyDown,
}) {
  return (
    <>
      <div className="row">
        <input
          className="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="örn: yumurta, patates, soğan"
        />
        <button className="btn" onClick={onAdd}>
          Ekle
        </button>
        <button className="btn" onClick={onClear}>
          Temizle
        </button>
      </div>

      <div className="hint">
        İpucu: “yumurta, süt” diye yapıştır → otomatik ayırırım. Enter = hızlı ekle.
      </div>
    </>
  );
}
