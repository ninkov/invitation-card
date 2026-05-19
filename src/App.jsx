import { useMemo, useRef, useState } from "react";
import { toBlob, toPng } from "html-to-image";
import download from "downloadjs";

import "./App.css";
import frozenKingdom from "./assets/frozen-kingdom.jpg";
import spiderMan from "./assets/spider-man.jpg";
import marvel from "./assets/modern-avengers.jpg";
import partyDefault from "./assets/BDAI.webp";

const templates = [
  {
    id: "birthday",
    name: "Детски рожден ден",
    accent: "#0f8ab3",
    background: partyDefault,
    fields: {
      hostName: "Ники",
      guestName: "Алекс",
      eventTitle: "Рожден ден",
      place: "Парти център Лъки",
      date: "15 юни 2026",
      time: "17:30",
      rsvpDate: "10 юни",
      note: "Ще има игри, смях и много изненади.",
    },
  },
  {
    id: "frozen",
    name: "Frozen парти",
    accent: "#56a6c8",
    background: frozenKingdom,
    fields: {
      hostName: "Ема",
      guestName: "Мая",
      eventTitle: "Приказно Frozen парти",
      place: "Парти център Лъки",
      date: "22 юни 2026",
      time: "16:00",
      rsvpDate: "18 юни",
      note: "Очакват те музика, танци и ледено красива торта.",
    },
  },
  {
    id: "spider",
    name: "Spider герой",
    accent: "#d83b3b",
    background: spiderMan,
    fields: {
      hostName: "Мартин",
      guestName: "Виктор",
      eventTitle: "Супергеройски рожден ден",
      place: "Парти център Лъки",
      date: "30 юни 2026",
      time: "18:00",
      rsvpDate: "25 юни",
      note: "Облечи се удобно за мисии, игри и героични снимки.",
    },
  },
  {
    id: "marvel",
    name: "Marvel покана",
    accent: "#f0b23f",
    background: marvel,
    fields: {
      hostName: "Дани",
      guestName: "Крис",
      eventTitle: "Avengers рожден ден",
      place: "Парти център Лъки",
      date: "7 юли 2026",
      time: "17:00",
      rsvpDate: "3 юли",
      note: "Събираме отбора за игри, снимки и празнични изненади.",
    },
  },
];

const fieldLabels = {
  guestName: "Име на гост",
  hostName: "Име на празнуващ",
  eventTitle: "Заглавие",
  place: "Място",
  date: "Дата",
  time: "Час",
  rsvpDate: "Потвърждение до",
  note: "Допълнителен текст",
};

const shareTargets = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    getFallbackUrl: (text) => `https://wa.me/?text=${encodeURIComponent(text)}`,
  },
  {
    id: "viber",
    label: "Viber",
    getFallbackUrl: (text) => `viber://forward?text=${encodeURIComponent(text)}`,
  },
  {
    id: "facebook",
    label: "Facebook",
    getFallbackUrl: (text) =>
      `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`,
  },
];
const layoutOptions = [
  { id: "upper", label: "Горе" },
  { id: "middle", label: "Среда" },
  { id: "lower", label: "Долу" },
];

function fileToDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.readAsDataURL(file);
  });
}

function App() {
  const [activeTemplateId, setActiveTemplateId] = useState(templates[0].id);
  const activeTemplate = templates.find((item) => item.id === activeTemplateId);
  const [card, setCard] = useState(templates[0].fields);
  const [photo, setPhoto] = useState("");
  const [customBackground, setCustomBackground] = useState("");
  const [contentPosition, setContentPosition] = useState("middle");
  const [shareStatus, setShareStatus] = useState("");
  const cardRef = useRef(null);

  const background = customBackground || activeTemplate.background;

  const message = useMemo(
    () =>
      `Здравей, ${card.guestName}! Каня те на ${card.eventTitle} на ${card.hostName}. Място: ${card.place}. Дата: ${card.date}, час: ${card.time}. ${card.note} Моля, потвърди до ${card.rsvpDate}.`,
    [card],
  );

  const updateField = (field, value) => {
    setCard((current) => ({ ...current, [field]: value }));
  };

  const chooseTemplate = (template) => {
    setActiveTemplateId(template.id);
    setCard(template.fields);
    setCustomBackground("");
    setShareStatus("");
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const dataUrl = await fileToDataUrl(file);
    setPhoto(dataUrl);
  };

  const handleBackgroundUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const dataUrl = await fileToDataUrl(file);
    setCustomBackground(dataUrl);
  };

  const exportCard = async () => {
    if (!cardRef.current) return;

    const dataUrl = await toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
    });
    download(dataUrl, `pokana-${card.hostName || "card"}.png`);
  };

  const createCardFile = async () => {
    if (!cardRef.current) return;

    const blob = await toBlob(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
    });

    if (!blob) {
      setShareStatus("Не успях да генерирам изображение за споделяне.");
      return;
    }

    return new File([blob], `pokana-${card.hostName || "card"}.png`, {
      type: "image/png",
    });
  };

  const openFallbackTarget = (target) => {
    if (!target?.getFallbackUrl) return;

    window.open(target.getFallbackUrl(message), "_blank", "noopener,noreferrer");
  };

  const shareCard = async (target) => {
    const file = await createCardFile();
    const targetLabel = target?.label || "избраното приложение";

    if (!file) return;

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: card.eventTitle,
          text: message,
          files: [file],
        });
        setShareStatus(`Поканата е подадена като PNG. Избери ${targetLabel} от менюто за споделяне.`);
      } catch (error) {
        if (error.name !== "AbortError") {
          setShareStatus("Споделянето беше прекъснато от браузъра. Можеш да свалиш PNG и да го изпратиш ръчно.");
        }
      }
      return;
    }

    download(await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 }), file.name);
    openFallbackTarget(target);
    setShareStatus(
      target
        ? `Свалих PNG поканата и отворих ${targetLabel}. Прикачи сваления файл в разговора или публикацията.`
        : "Този браузър не позволява директно изпращане на PNG файл. Свалих поканата, за да я прикачиш ръчно.",
    );
  };

  return (
    <main className="app-shell">
      <section className="workspace">
        <aside className="editor-panel" aria-label="Редактор на покана">
          <div className="brand-row">
            <div>
              <p className="eyebrow">Invitation studio</p>
              <h1>Създай динамична покана</h1>
            </div>
            <span className="status-pill">PNG + Share</span>
          </div>

          <div className="control-group">
            <h2>Темплейт</h2>
            <div className="template-grid">
              {templates.map((template) => (
                <button
                  key={template.id}
                  className={`template-button ${template.id === activeTemplateId ? "is-active" : ""}`}
                  onClick={() => chooseTemplate(template)}
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
                  <textarea value={card[field]} onChange={(event) => updateField(field, event.target.value)} rows="4" />
                ) : (
                  <input value={card[field]} onChange={(event) => updateField(field, event.target.value)} />
                )}
              </label>
            ))}
          </div>

          <div className="upload-row">
            <label className="file-control">
              <span>Снимка в поканата</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} />
            </label>
            <label className="file-control">
              <span>Собствен фон</span>
              <input type="file" accept="image/*" onChange={handleBackgroundUpload} />
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
            <button type="button" className="primary-action" onClick={exportCard}>
              Свали PNG
            </button>
            <button type="button" className="secondary-action" onClick={() => shareCard()}>
              Сподели PNG
            </button>
          </div>

          <div className="share-links" aria-label="Изпращане на завършена покана">
            {shareTargets.map((target) => (
              <button key={target.id} type="button" onClick={() => shareCard(target)}>
                {target.label}
              </button>
            ))}
          </div>

          {shareStatus && <p className="share-status">{shareStatus}</p>}
        </aside>

        <section className="preview-panel" aria-label="Преглед на покана">
          <div
            ref={cardRef}
            id="card"
            className={`invitation-card content-${contentPosition}`}
            style={{
              "--accent": activeTemplate.accent,
              backgroundImage: `linear-gradient(90deg, rgba(9, 23, 32, 0.7), rgba(9, 23, 32, 0.12)), url(${background})`,
            }}
          >
            <div className="card-content">
              <p className="card-kicker">Покана за</p>
              <h2>{card.eventTitle}</h2>
              <p className="guest-line">Скъпи {card.guestName},</p>
              <p className="invite-copy">
                {card.hostName} те кани да празнувате заедно в {card.place}.
              </p>

              <div className="event-details">
                <span>{card.date}</span>
                <span>{card.time}</span>
              </div>

              <p className="note">{card.note}</p>
              <p className="rsvp">Потвърди до {card.rsvpDate}</p>
            </div>

            {photo && (
              <div className="photo-frame">
                <img src={photo} alt="Снимка за поканата" />
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
