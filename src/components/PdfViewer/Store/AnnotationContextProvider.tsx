import { ReactElement, useEffect, useState } from "react";
import { type PdfAnnotationObject } from "@embedpdf/models";
import { annotationContext } from "./AnnotationContext";
import { getBookAnnotations } from "@/utils/queries/booksApi";
import { useActiveDocument } from "@embedpdf/plugin-document-manager/react";
export default function AnnotationContextProvider(props: {
  children: ReactElement[];
}) {
  const [annots, setAnnots] = useState<PdfAnnotationObject[]>([]);
  const { activeDocumentId } = useActiveDocument();
  useEffect(() => {
    if (!activeDocumentId) return;
    getBookAnnotations({ bookId: activeDocumentId }).then((annots) => {
      setAnnots(
        annots.map(
          (annot: { annotationDetails: PdfAnnotationObject[]; id: string }) =>
            annot.annotationDetails
        )
      );
    });
  }, [activeDocumentId]);

  const removeAnnotation = (id: string) => {
    setAnnots((prev: PdfAnnotationObject[]) =>
      prev.filter((annot) => !(annot.id == id))
    );
  };
  const setAnnotations = (annots: PdfAnnotationObject[]) => {
    setAnnots(annots);
  };
  const AnnotationContextValue = {
    annots: annots,
    setAnnots: setAnnotations,
    removeAnnot: removeAnnotation,
  };
  return (
    <annotationContext.Provider value={AnnotationContextValue}>
      {props.children}
    </annotationContext.Provider>
  );
}
