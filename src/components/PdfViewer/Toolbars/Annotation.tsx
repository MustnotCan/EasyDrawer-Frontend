import { ReactElement, useEffect, useState } from "react";
import { useAnnotationCapability } from "@embedpdf/plugin-annotation/react";
import { Button, Stack } from "@chakra-ui/react";
import { LiaSave } from "react-icons/lia";
import { type PdfAnnotationObject } from "@embedpdf/models";
import {
  PiHighlighter,
  PiTextUnderline,
  PiPen,
  PiHighlighterThin,
} from "react-icons/pi";
import { PiScribble } from "react-icons/pi";
import { Tooltip } from "../../../ui/tooltip";
import {
  getBookAnnotations,
  saveBookAnnotations,
} from "../../../utils/queries/booksApi";
import {
  useActiveDocument,
  useDocumentManagerCapability,
} from "@embedpdf/plugin-document-manager/react";
import { IoSquareOutline, IoText } from "react-icons/io5";
import { BiPolygon } from "react-icons/bi";
import { MdOutlinePolyline } from "react-icons/md";
import { HiOutlineArrowRight } from "react-icons/hi";
import { TbCircle, TbLine } from "react-icons/tb";
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

  function toggleTool(toolId: string) {
    const activeTool = annotationApi?.getActiveTool()?.id;
    if (activeTool == toolId) {
      annotationApi?.setActiveTool(null);
    } else {
      if (
        [
          "circle",
          "square",
          "line",
          "polyline",
          "polygon",
          "lineArrow",
        ].includes(toolId)
      ) {
        annotationApi?.setToolDefaults(toolId, { strokeWidth: 3 });
      }
      annotationApi?.setActiveTool(toolId);
    }
  }
  return (
    <Stack justify={"center"} direction={"row"} align={"center"}>
      <StyledButton
        tooltip={"Highlight"}
        onClick={() => toggleTool("highlight")}
      >
        <PiHighlighter />
      </StyledButton>
      <StyledButton tooltip={"Pen"} onClick={() => toggleTool("ink")}>
        <PiPen />
      </StyledButton>
      <StyledButton
        tooltip={"Underline"}
        onClick={() => toggleTool("underline")}
      >
        <PiTextUnderline />
      </StyledButton>
      <StyledButton tooltip={"Squiggly"} onClick={() => toggleTool("squiggly")}>
        <PiScribble />
      </StyledButton>
      <StyledButton
        tooltip={"Ink Highlighter"}
        onClick={() => toggleTool("inkHighlighter")}
      >
        <PiHighlighterThin />
      </StyledButton>

      <StyledButton
        tooltip={"Free Text"}
        onClick={() => toggleTool("freeText")}
      >
        <IoText />
      </StyledButton>
      <StyledButton tooltip={"Square"} onClick={() => toggleTool("square")}>
        <IoSquareOutline />
      </StyledButton>

      <StyledButton tooltip={"Circle"} onClick={() => toggleTool("circle")}>
        <TbCircle />
      </StyledButton>
      <StyledButton tooltip={"Line"} onClick={() => toggleTool("line")}>
        <TbLine />
      </StyledButton>
      <StyledButton tooltip={"Arrow"} onClick={() => toggleTool("lineArrow")}>
        <HiOutlineArrowRight />
      </StyledButton>
      <StyledButton tooltip={"Polygon"} onClick={() => toggleTool("polygon")}>
        <BiPolygon />
      </StyledButton>
      <StyledButton tooltip={"Polyline"} onClick={() => toggleTool("polyline")}>
        <MdOutlinePolyline />
      </StyledButton>
      <StyledButton
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
        tooltip="Save annotations"
      >
        <LiaSave />
      </StyledButton>
    </Stack>
  );
}
function StyledButton(props: {
  children: ReactElement;
  onClick: () => void;
  tooltip: string;
  disabled?: boolean;
}) {
  const { provides: annotationApi } = useAnnotationCapability();
  return (
    <Button
      disabled={props.disabled}
      variant={"outline"}
      size={"2xs"}
      backgroundColor={
        annotationApi?.getActiveTool()?.name == props.tooltip ? "gray.400" : ""
      }
      onClick={() => {
        props.onClick();
      }}
    >
      <Tooltip content={props.tooltip}>{props.children}</Tooltip>
    </Button>
  );
}
