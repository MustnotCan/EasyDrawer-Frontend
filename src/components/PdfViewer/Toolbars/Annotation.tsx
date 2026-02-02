import { useEffect, useState } from "react";
import { useAnnotationCapability } from "@embedpdf/plugin-annotation/react";
import { Button } from "@chakra-ui/react";
import { LiaSave } from "react-icons/lia";
import { type PdfAnnotationObject } from "@embedpdf/models";
import { Tooltip } from "../../../ui/tooltip";
import {
  getBookAnnotations,
  saveBookAnnotations,
} from "../../../utils/queries/booksApi";
import {
  useActiveDocument,
  useDocumentManagerCapability,
} from "@embedpdf/plugin-document-manager/react";
let modifiedAnnotations: { annotation: PdfAnnotationObject; status: string }[] =
  [];
export default function AnnotationToolBar() {
  const { activeDocumentId } = useActiveDocument();
  const { provides: annotationApi } = useAnnotationCapability();
  const { provides: loaderApi } = useDocumentManagerCapability();
  const [annotChanged, setAnnotChanged] = useState(false);
  const [annots, setAnnots] = useState<PdfAnnotationObject[]>([]);
  useEffect(() => {
    if (!loaderApi) return;
    return loaderApi.onDocumentOpened((doc) => {
      getBookAnnotations({ bookId: doc.id }).then((annots) =>
        setAnnots(
          annots.map(
            (annot: { annotationDetails: PdfAnnotationObject }) =>
              annot.annotationDetails
          )
        )
      );
    });
  }, [loaderApi]);
  useEffect(() => {
    if (!annotationApi) return;

    const Unsub = annotationApi.onAnnotationEvent((ev) => {
      const idsOnly = annots.map((annot) => annot.id);
      if (ev.type != "loaded") {
        if (ev.type == "delete" && ev.committed == false) {
          const exist = modifiedAnnotations.findIndex(
            (annot) => annot.annotation.id == ev.annotation.id
          );
          if (exist != -1 && !idsOnly.includes(ev.annotation.id)) {
            modifiedAnnotations = modifiedAnnotations.filter(
              (annot) => annot.annotation.id != ev.annotation.id
            );
          } else if (exist != -1 && idsOnly.includes(ev.annotation.id)) {
            modifiedAnnotations = modifiedAnnotations.filter(
              (annot) => annot.annotation.id != ev.annotation.id
            );
            modifiedAnnotations.push({
              annotation: ev.annotation,
              status: ev.type,
            });
          } else {
            modifiedAnnotations.push({
              annotation: ev.annotation,
              status: ev.type,
            });
          }
        } else if (ev.type == "update") {
          const exist = modifiedAnnotations.findIndex(
            (annot) => annot.annotation.id == ev.annotation.id
          );
          const patchedAnnot: PdfAnnotationObject = {
            ...ev.annotation,
            ...ev.patch,
          } as PdfAnnotationObject;
          if (exist != -1) {
            modifiedAnnotations[exist].annotation = patchedAnnot;
            modifiedAnnotations[exist].status = ev.type;
          } else {
            modifiedAnnotations.push({
              annotation: patchedAnnot,
              status: ev.type,
            });
          }
        } else if (ev.type == "create") {
          if (!idsOnly.includes(ev.annotation.id)) {
            if ([3, 4, 5, 6, 7, 8].includes(ev.annotation.type)) {
              annotationApi.setActiveTool(null);
            }
            const exist = modifiedAnnotations.findIndex(
              (annot) => annot.annotation.id == ev.annotation.id
            );
            const patchedAnnot: PdfAnnotationObject = {
              ...ev.annotation,
            } as PdfAnnotationObject;
            if (exist != -1) {
              modifiedAnnotations[exist].annotation = patchedAnnot;
              modifiedAnnotations[exist].status = ev.type;
            } else {
              modifiedAnnotations.push({
                annotation: patchedAnnot,
                status: ev.type,
              });
            }
          }
        }
      }
      if (modifiedAnnotations.length == 0) {
        setAnnotChanged(false);
      } else {
        setAnnotChanged(true);
      }
    });

    return Unsub;
  }, [annotationApi, annots]);

  return (
    <Button
      disabled={!annotChanged}
      onClick={() => {
        if (loaderApi) {
          annotationApi
            ?.commit()
            .toPromise()
            .then(() => {
              const fallback = [...modifiedAnnotations];
              setAnnotChanged(false);
              modifiedAnnotations = [];
              saveBookAnnotations({
                bookId: activeDocumentId!,
                annotations: fallback,
              }).catch(() => {
                modifiedAnnotations = [...modifiedAnnotations, ...fallback];
                setAnnotChanged(true);
              });
            });
        }
      }}
      variant={"outline"}
      size={"2xs"}
    >
      <Tooltip content={"Save annotations"}>
        <LiaSave />
      </Tooltip>
    </Button>
  );
}
