import { useEffect, useRef, useState } from "react";
import download from "downloadjs";

import "./App.css";
import InvitationEditor from "./components/InvitationEditor";
import InvitationPreview from "./components/InvitationPreview";
import { fieldLabels, layoutOptions, partyDefault, shareTargets, templates } from "./data/invitationData";
import { renderCardToDataUrl } from "./utility/cardRenderer";
import { dataUrlToFile, fileToDataUrl, imageUrlToDataUrl } from "./utility/imageFiles";

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

  const getRenderPayload = () => ({
    accent: activeTemplate.accent,
    background: embeddedBackground,
    card,
    contentPosition,
    photo,
  });

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

    setPhoto(await fileToDataUrl(file));
  };

  const handleBackgroundUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCustomBackground(await fileToDataUrl(file));
  };

  const exportCard = async () => {
    const dataUrl = await renderCardToDataUrl(getRenderPayload());
    download(dataUrl, `pokana-${card.hostName || "card"}.png`);
  };

  const createCardFile = async () => {
    const dataUrl = await renderCardToDataUrl(getRenderPayload());

    if (!dataUrl) {
      setShareStatus("Не успях да генерирам изображение за споделяне.");
      return null;
    }

    return dataUrlToFile(dataUrl, "invitation-card.png");
  };

  const shareCard = async () => {
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

    const dataUrl = await renderCardToDataUrl(getRenderPayload());
    download(dataUrl, file.name);
    setShareStatus("Този браузър не позволява директно споделяне на PNG. Свалих поканата, за да я прикачиш ръчно.");
  };

  return (
    <main className="app-shell">
      <section className="workspace">
        <InvitationEditor
          activeTemplateId={activeTemplateId}
          card={card}
          contentPosition={contentPosition}
          fieldLabels={fieldLabels}
          layoutOptions={layoutOptions}
          onBackgroundUpload={handleBackgroundUpload}
          onChooseTemplate={chooseTemplate}
          onExport={exportCard}
          onPhotoUpload={handlePhotoUpload}
          onShare={shareCard}
          onUpdateField={updateField}
          setContentPosition={setContentPosition}
          shareStatus={shareStatus}
          shareTargets={shareTargets}
          templates={templates}
        />
        <InvitationPreview
          ref={cardRef}
          accent={activeTemplate.accent}
          background={embeddedBackground}
          card={card}
          contentPosition={contentPosition}
          photo={photo}
        />
      </section>
    </main>
  );
}

export default App;
