export function fileToDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.readAsDataURL(file);
  });
}

export async function imageUrlToDataUrl(url) {
  if (url.startsWith("data:")) return url;

  const response = await fetch(url);
  const blob = await response.blob();
  return fileToDataUrl(blob);
}

export function dataUrlToFile(dataUrl, fileName) {
  const [header, base64Data] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/png";
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new File([bytes], fileName, { type: mime });
}
