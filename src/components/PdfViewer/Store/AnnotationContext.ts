import { type PdfAnnotationObject } from "@embedpdf/models";
import { createContext } from "react";

export type contextType = {
  annots: PdfAnnotationObject[];
  setAnnots: (annots: PdfAnnotationObject[]) => void;
  removeAnnot: (id: string) => void;
};
export const annotationContext = createContext<contextType>({
  annots: [],
  setAnnots: () => {},
  removeAnnot: () => {},
});
