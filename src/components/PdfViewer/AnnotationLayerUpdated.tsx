import { useEffect, useContext, useState } from "react";
import {
  AnnotationStateChangeEvent,
  useAnnotationCapability,
} from "@embedpdf/plugin-annotation/react";
import { type PdfAnnotationObject } from "@embedpdf/models";
import { annotationContext } from "./Store/AnnotationContext";

export default function AnnotationLayerUpdated(props: { pageIndex: number }) {
  const { provides: annotationApi } = useAnnotationCapability();
  const [annotationState, setState] = useState<AnnotationStateChangeEvent>();
  const { annots } = useContext(annotationContext);
  const filteredAnnots: PdfAnnotationObject[] = annots.filter(
    (annot: PdfAnnotationObject) => {
      return annot.pageIndex == props.pageIndex;
    }
  );
  useEffect(() => {
    if (!annotationApi) return;
    annotationApi.onStateChange((state) => setState(state));
  }, [annotationApi]);
  useEffect(() => {
    if (!annotationApi || !annotationState) return;
    if (filteredAnnots.length > 0) {
      filteredAnnots.forEach((annot) => {
        const annotation = {
          ...annot,
          created: annot.created ? new Date(annot.created) : new Date(),
        };
        if (
          annotationState.state.pages[props.pageIndex] &&
          !annotationState.state.pages[props.pageIndex].includes(annot.id)
        ) {
          annotationApi.importAnnotations([{ annotation: annotation }]);
        }
      });
    }
    return () => {};
  }, [annotationApi, annotationState, filteredAnnots, props.pageIndex]);
  return <></>;
}
