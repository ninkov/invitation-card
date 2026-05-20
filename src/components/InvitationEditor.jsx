export default function InvitationEditor({
  activeTemplateId,
  card,
  contentPosition,
  fieldLabels,
  layoutOptions,
  onBackgroundUpload,
  onChooseTemplate,
  onExport,
  onPhotoUpload,
  onShare,
  onUpdateField,
  setContentPosition,
  shareStatus,
  shareTargets,
  templates,
}) {
  return (
    <aside className="editor-panel" aria-label="Редактор на покана">
      <div className="brand-row">
        <div>
          <h1>Създай динамична покана</h1>
        </div>
      </div>

      <div className="control-group">
        <h2>Темплейт</h2>
        <div className="template-grid">
          {templates.map((template) => (
            <button
              key={template.id}
              className={`template-button ${template.id === activeTemplateId ? "is-active" : ""}`}
              onClick={() => onChooseTemplate(template)}
              type="button"
              style={{ "--accent": template.accent }}
            >
              <span className="template-swatch" />
              {template.name}
            </button>
          ))}
        </div>
      </div>

      <div className="control-grid">
        {Object.entries(fieldLabels).map(([field, label]) => (
          <label key={field} className={field === "note" ? "wide-field" : ""}>
            <span>{label}</span>
            {field === "note" ? (
              <textarea value={card[field]} onChange={(event) => onUpdateField(field, event.target.value)} rows="4" />
            ) : (
              <input value={card[field]} onChange={(event) => onUpdateField(field, event.target.value)} />
            )}
          </label>
        ))}
      </div>

      <div className="upload-row">
        <label className="file-control">
          <span>Снимка в поканата</span>
          <input type="file" accept="image/*" onChange={onPhotoUpload} />
        </label>
        <label className="file-control">
          <span>Собствен фон</span>
          <input type="file" accept="image/*" onChange={onBackgroundUpload} />
        </label>
      </div>

      <div className="control-group layout-control">
        <h2>Позиция на текста</h2>
        <div className="segmented-control">
          {layoutOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={contentPosition === option.id ? "is-active" : ""}
              onClick={() => setContentPosition(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="actions">
        <button type="button" className="primary-action" onClick={onExport}>
          Свали PNG
        </button>
        <button type="button" className="secondary-action" onClick={onShare}>
          Сподели PNG
        </button>
      </div>

      <div className="share-links" aria-label="Изпращане на завършена покана">
        {shareTargets.map((target) => (
          <button key={target.id} type="button" onClick={onShare}>
            {target.label}
          </button>
        ))}
      </div>
      <p className="share-hint">
        Бутоните отварят системното меню за споделяне с готов PNG. Избери съответното приложение от менюто.
      </p>

      {shareStatus && <p className="share-status">{shareStatus}</p>}
    </aside>
  );
}
