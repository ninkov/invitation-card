import { toPng } from "html-to-image";
import download from "downloadjs";

export default function ExportButton() {
  const exportCard = () => {
    const node = document.getElementById("card");
    toPng(node)
      .then((dataUrl) => {
        download(dataUrl, "invitation-card.png");
      })
      .catch((error) => {
        console.log("Error exporting the cad", error);
      });
  };
  return (
    <button onClick={exportCard} className="export-button">
      Export Card
    </button>
  );
}
