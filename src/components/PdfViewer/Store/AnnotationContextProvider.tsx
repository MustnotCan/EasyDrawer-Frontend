import { ReactElement, useCallback } from "react";
import { type PdfAnnotationObject } from "@embedpdf/models";
import { annotationContext } from "./AnnotationContext";
export default function AnnotationContextProvider(props: {
  children: ReactElement[];
  annots: PdfAnnotationObject[];
  setAnnots: React.Dispatch<React.SetStateAction<PdfAnnotationObject[]>>;
}) {
  const removeAnnotation = useCallback(
    (id: string) => {
      props.setAnnots((prev: PdfAnnotationObject[]) =>
        prev.filter((annot) => !(annot.id == id))
      );
    },
    [props]
  );
  const setAnnotations = useCallback(
    (annots: PdfAnnotationObject[]) => {
      props.setAnnots(annots);
    },
    [props]
  );
  const AnnotationContextValue = {
    annots: props.annots,
    setAnnots: setAnnotations,
    removeAnnot: removeAnnotation,
  };
  return (
    <annotationContext.Provider value={AnnotationContextValue}>
      {props.children}
    </annotationContext.Provider>
  );
}
