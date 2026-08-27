export default function MediaField({ label, value = '', onChange, hint = 'Paste an image URL or a /public asset path.' }) {
  return (
    <label className="media-field">
      <span>{label}</span>
      <input
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://... or /images/player.webp"
      />
      <small>{hint}</small>
      {value ? (
        <div className="media-preview">
          <img src={value} alt={`${label} preview`} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
      ) : null}
    </label>
  );
}
