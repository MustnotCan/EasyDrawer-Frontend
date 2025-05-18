import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function PdfReader() {
  // This route will display the PDF
  const params = useParams();
  useEffect(() => {
    console.log(params);
  });
  return (
    <iframe
      src={params.path}
      width="100%"
      height="800px"
      title="PDF Viewer"
      style={{ border: "none" }}
    />
  );
}
