const params = new URLSearchParams(window.location.search);
const visitingSpecificPage = window.location.href.includes("#");
const pathId = params.get("pathId");
async function loadConfig() {
  const response = await fetch("/config.json");
  const config = await response.json();
  return config;
}
document.addEventListener("DOMContentLoaded", async () => {
  const VITE_API_MAIN = (await loadConfig()).VITE_API_MAIN;
  const app = PDFViewerApplication;
  if (!pathId) {
    console.error("No file parameter provided in URL");
    return;
  }
  const lastPage = Number(localStorage.getItem(pathId + "lastPage")) || 1;

  app.open({ url: `${VITE_API_MAIN}pdfs/${pathId}` });

  async function modifiedSave() {
    console.log("Saving ...");
    const data = await app.pdfDocument.saveDocument();
    const existingData = (await app.pdfDocument.getData()).byteLength;
    if (data.byteLength != existingData.byteLength) {
      await fetch(VITE_API_MAIN + "saveViewerEdit/" + pathId, {
        method: "POST",
        headers: { "Content-Type": "application/pdf" },
        body: data,
      });
      alert("saved");
    }
  }
  app.download = modifiedSave;
  app.downloadOrSave = modifiedSave;
  app.save = modifiedSave;
  app.eventBus.on("pagechanging", (evt) => {
    if (!visitingSpecificPage)
      localStorage.setItem(pathId + "lastPage", evt.pageNumber);
  });

  app.eventBus.on("pagesloaded", () => {
    if (!visitingSpecificPage) {
      setTimeout(() => {
        app.page = lastPage;
      }, 0);
    }
  });
});
