import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function PdfReader() {
  const params = useParams();

  useEffect(() => {
    document.title =
      params.path?.slice(params.path?.lastIndexOf("/") + 1) || "PDF Viewer";
  }, [params.path]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <iframe
        src={`${import.meta.env.VITE_API_MAIN}pdfs` + params.path}
        width="100%"
        height="1000px"
        title="PDF Viewer"
        style={{ width: "100vw", height: "46.4vw" }}
      />
    </div>
  );
}
