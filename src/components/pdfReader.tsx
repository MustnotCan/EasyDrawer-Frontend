import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { VITE_API_MAIN } from "../utils/envVar.ts";
import PDFViewer from "./PdfViewer/PDFViewer";

export default function PdfReader() {
  const params = useParams();
  useEffect(() => {
    const defaultTitle = "Pdf reader";

    let title = defaultTitle;

    if (params.path) {
      const key = params.path.substring(params.path.lastIndexOf("/") + 1);
      title = localStorage.getItem(key) || defaultTitle;
    }

    document.title = title;
  }, [params]);
  if (params.path) {
    return (
      <PDFViewer
        pdfId={params.path || ""}
        pdfUrl={VITE_API_MAIN + "pdfs/" + params.path}
        pdfPage={Number(params.page) || undefined}
      />
    );
  } else {
    return <div>No pdf id is provided</div>;
  }
}
