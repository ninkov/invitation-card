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

function drawPill(context, text, x, y, accent, fontSize = 34) {
  context.save();
  context.font = `800 ${fontSize}px Inter, Arial, sans-serif`;
  context.textBaseline = "middle";
  context.shadowColor = "transparent";
  const paddingX = 30;
  const width = context.measureText(text).width + paddingX * 2;
  const height = 64;

  context.fillStyle = accent;
  drawRoundedRect(context, x, y, width, height, height / 2);
  context.fill();

  context.fillStyle = "#ffffff";
  context.fillText(text, x + paddingX, y + height / 2);
  context.restore();

  return { width, height };
}

export async function renderCardToDataUrl({ accent, background, card, contentPosition, photo }) {
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
  const maxWidth = 800;
  const startYByPosition = {
    upper: 190,
    middle: 520,
    lower: 620,
  };
  let y = startYByPosition[contentPosition] || startYByPosition.middle;

  context.textBaseline = "top";
  context.shadowColor = "rgba(0, 0, 0, 0.44)";
  context.shadowBlur = 18;
  context.shadowOffsetY = 5;

  context.fillStyle = "#e8f5fb";
  context.font = "900 30px Inter, Arial, sans-serif";
  context.fillText("ПОКАНА ЗА", x, y);
  y += 58;

  context.fillStyle = "#ffffff";
  context.font = "900 76px Inter, Arial, sans-serif";
  y = drawTextBlock(context, card.eventTitle, x, y, maxWidth, 82) + 20;

  context.font = "900 38px Inter, Arial, sans-serif";
  context.fillText(`${card.salutation} ${card.guestName},`, x, y);
  y += 66;

  context.font = "400 34px Inter, Arial, sans-serif";
  y = drawTextBlock(context, `${card.hostName} те кани да празнувате заедно в ${card.place}.`, x, y, maxWidth, 50) + 26;

  const datePill = drawPill(context, card.date, x, y, accent);
  drawPill(context, card.time, x + datePill.width + 28, y, accent);
  y += datePill.height + 36;

  context.shadowColor = "rgba(0, 0, 0, 0.44)";
  context.fillStyle = "#ffffff";
  context.textBaseline = "top";
  context.font = "400 34px Inter, Arial, sans-serif";
  y = drawTextBlock(context, card.note, x, y, maxWidth, 50) + 36;

  drawPill(context, `Потвърди до ${card.rsvpDate}`, x, Math.min(y, height - 150), accent, 34);

  return canvas.toDataURL("image/png");
}
