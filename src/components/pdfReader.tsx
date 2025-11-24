import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function PdfjsReader() {
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
    <div style={{ width: "100vw" }}>
      <iframe
        src={`/pdfjs/web/viewer.html?pathId=${params.path}${params.page ? `#page=${params.page}` : ""}`}
        style={{ width: "100vw", height: "100vh" }}
      ></iframe>
    </div>
  );
}
