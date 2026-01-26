import { openDB } from "idb";

const DB_NAME = "PdfStore";
const DB_VERSION = 1;
type pdfData = { data: ArrayBuffer };
export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("pdfs")) {
      db.createObjectStore("pdfs");
    }
  },
});

export async function savePdf(id: string, pdfData: pdfData) {
  const db = await dbPromise;
  await db.put("pdfs", { data: pdfData.data }, id);
}

export async function getPdf(id: string): Promise<pdfData | undefined> {
  const db = await dbPromise;
  return db.get("pdfs", id);
}
export async function removePdf(id: string) {
  const db = await dbPromise;
  return db.delete("pdfs", id);
}
