import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { VITE_API_MAIN } from "../utils/envVar";
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

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
      <iframe
        src={`${VITE_API_MAIN}pdfs/${params.path}${
          params.page ? `#page=${params.page}` : ""
        }`}
        width="100%"
        height="100%"
        title="PDF Viewer"
        style={{
          width: "100%",
          border: "none",
        }}
      />
    </div>
  );
}
