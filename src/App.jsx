import { useEffect, useRef, useState } from "react";
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
  { id: "whatsapp", label: "WhatsApp" },
  { id: "viber", label: "Viber" },
  { id: "facebook", label: "Facebook" },
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

async function imageUrlToDataUrl(url) {
  if (url.startsWith("data:")) return url;

  const response = await fetch(url);
  const blob = await response.blob();
  return fileToDataUrl(blob);
}

function dataUrlToFile(dataUrl, fileName) {
  const [header, base64Data] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/png";
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new File([bytes], fileName, { type: mime });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function drawCoverImage(context, image, width, height, targetX = 0, targetY = 0) {
  const scale = Math.max(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const x = targetX + (width - drawWidth) / 2;
  const y = targetY + (height - drawHeight) / 2;

  context.drawImage(image, x, y, drawWidth, drawHeight);
}

function drawRoundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function wrapText(context, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;

    if (context.measureText(testLine).width <= maxWidth || !line) {
      line = testLine;
      return;
    }

    lines.push(line);
    line = word;
  });

  if (line) lines.push(line);
  return lines;
}

function drawTextBlock(context, text, x, y, maxWidth, lineHeight) {
  const lines = wrapText(context, text, maxWidth);

  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });

  return y + lines.length * lineHeight;
}

function drawPill(context, text, x, y, accent, fontSize = 42) {
  context.font = `800 ${fontSize}px Inter, Arial, sans-serif`;
  const paddingX = 34;
  const width = context.measureText(text).width + paddingX * 2;
  const height = 74;

  context.fillStyle = accent;
  drawRoundedRect(context, x, y, width, height, height / 2);
  context.fill();

  context.fillStyle = "#ffffff";
  context.fillText(text, x + paddingX, y + 49);

  return { width, height };
}

async function renderCardToDataUrl({ accent, background, card, contentPosition, photo }) {
  const width = 1200;
  const height = 1500;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;

  const backgroundImage = await loadImage(background);
  drawCoverImage(context, backgroundImage, width, height);

  const overlay = context.createLinearGradient(0, 0, width, 0);
  overlay.addColorStop(0, "rgba(9, 23, 32, 0.70)");
  overlay.addColorStop(1, "rgba(9, 23, 32, 0.12)");
  context.fillStyle = overlay;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(255, 255, 255, 0.78)";
  context.lineWidth = 5;
  drawRoundedRect(context, 50, 50, width - 100, height - 100, 14);
  context.stroke();

  if (photo) {
    const photoImage = await loadImage(photo);
    const size = 220;
    const x = width - size - 80;
    const y = 86;

    context.save();
    context.fillStyle = "rgba(255, 255, 255, 0.92)";
    context.beginPath();
    context.arc(x + size / 2, y + size / 2, size / 2 + 11, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    context.clip();
    drawCoverImage(context, photoImage, size, size, x, y);
    context.restore();
  }

  const x = 90;
  const maxWidth = 880;
  const startYByPosition = {
    upper: 210,
    middle: 420,
    lower: 720,
  };
  let y = startYByPosition[contentPosition] || startYByPosition.middle;

  context.textBaseline = "top";
  context.shadowColor = "rgba(0, 0, 0, 0.44)";
  context.shadowBlur = 18;
  context.shadowOffsetY = 5;

  context.fillStyle = "#e8f5fb";
  context.font = "900 34px Inter, Arial, sans-serif";
  context.fillText("ПОКАНА ЗА", x, y);
  y += 64;

  context.fillStyle = "#ffffff";
  context.font = "900 92px Inter, Arial, sans-serif";
  y = drawTextBlock(context, card.eventTitle, x, y, maxWidth, 98) + 20;

  context.font = "900 44px Inter, Arial, sans-serif";
  context.fillText(`Скъпи ${card.guestName},`, x, y);
  y += 76;

  context.font = "400 40px Inter, Arial, sans-serif";
  y = drawTextBlock(context, `${card.hostName} те кани да празнувате заедно в ${card.place}.`, x, y, maxWidth, 58) + 28;

  context.shadowColor = "transparent";
  const datePill = drawPill(context, card.date, x, y, accent);
  drawPill(context, card.time, x + datePill.width + 34, y, accent);
  y += datePill.height + 42;

  context.shadowColor = "rgba(0, 0, 0, 0.44)";
  context.fillStyle = "#ffffff";
  context.font = "400 40px Inter, Arial, sans-serif";
  y = drawTextBlock(context, card.note, x, y, maxWidth, 58) + 42;

  context.shadowColor = "transparent";
  drawPill(context, `Потвърди до ${card.rsvpDate}`, x, y, accent, 40);

  return canvas.toDataURL("image/png");
}

function App() {
  const [activeTemplateId, setActiveTemplateId] = useState(templates[0].id);
  const activeTemplate = templates.find((item) => item.id === activeTemplateId);
  const [card, setCard] = useState(templates[0].fields);
  const [photo, setPhoto] = useState("");
  const [customBackground, setCustomBackground] = useState("");
  const [embeddedBackground, setEmbeddedBackground] = useState(partyDefault);
  const [contentPosition, setContentPosition] = useState("middle");
  const [shareStatus, setShareStatus] = useState("");
  const cardRef = useRef(null);

  const background = customBackground || activeTemplate.background;

  useEffect(() => {
    let isActive = true;

    imageUrlToDataUrl(background)
      .then((dataUrl) => {
        if (isActive) setEmbeddedBackground(dataUrl);
      })
      .catch(() => {
        if (isActive) setEmbeddedBackground(background);
      });

    return () => {
      isActive = false;
    };
  }, [background]);

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
    const dataUrl = await renderCardToDataUrl({
      accent: activeTemplate.accent,
      background: embeddedBackground,
      card,
      contentPosition,
      photo,
    });
    download(dataUrl, `pokana-${card.hostName || "card"}.png`);
  };

  const createCardFile = async () => {
    const dataUrl = await renderCardToDataUrl({
      accent: activeTemplate.accent,
      background: embeddedBackground,
      card,
      contentPosition,
      photo,
    });

    if (!dataUrl) {
      setShareStatus("Не успях да генерирам изображение за споделяне.");
      return;
    }

    return dataUrlToFile(dataUrl, "invitation-card.png");
  };

  const shareCard = async (target) => {
    const file = await createCardFile();

    if (!file) return;

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
        });
        setShareStatus("Поканата беше подадена към менюто за споделяне като PNG.");
      } catch (error) {
        if (error.name !== "AbortError") {
          setShareStatus("Споделянето беше прекъснато от браузъра. Можеш да свалиш PNG и да го изпратиш ръчно.");
        }
      }
      return;
    }

    const dataUrl = await renderCardToDataUrl({
      accent: activeTemplate.accent,
      background: embeddedBackground,
      card,
      contentPosition,
      photo,
    });
    download(dataUrl, file.name);
    setShareStatus(
      target
        ? "Този браузър не позволява директно споделяне на PNG. Свалих поканата, за да я прикачиш ръчно."
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
              <button key={target.id} type="button" onClick={() => shareCard()}>
                {target.label}
              </button>
            ))}
          </div>
          <p className="share-hint">
            Бутоните отварят системното меню за споделяне с готов PNG. Избери съответното приложение от менюто.
          </p>

          {shareStatus && <p className="share-status">{shareStatus}</p>}
        </aside>

        <section className="preview-panel" aria-label="Преглед на покана">
          <div
            ref={cardRef}
            id="card"
            className={`invitation-card content-${contentPosition}`}
            style={{
              "--accent": activeTemplate.accent,
            }}
          >
            <img className="card-background" src={embeddedBackground} alt="" aria-hidden="true" />
            <div className="card-overlay" />
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
