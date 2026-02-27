import {
  AnnotationCapability,
  useAnnotationCapability,
} from "@embedpdf/plugin-annotation/react";
import { Scroller, useScrollCapability } from "@embedpdf/plugin-scroll/react";
import { Viewport } from "@embedpdf/plugin-viewport/react";
import {
  DocumentContent,
  useDocumentManagerCapability,
} from "@embedpdf/plugin-document-manager/react";
import { ReactElement, useEffect, useRef, useState } from "react";
import PageRender from "./PageRender";
import { updateBookLastAccess } from "../../utils/queries/booksApi";
import { getPdf } from "../db";
import { GlobalPointerProvider } from "@embedpdf/plugin-interaction-manager/react";
import { Box, Button, HStack, Menu, Portal } from "@chakra-ui/react";
import {
  PiHighlighter,
  PiHighlighterThin,
  PiPen,
  PiScribble,
  PiTextUnderline,
} from "react-icons/pi";
import { Tooltip } from "@/ui/tooltip";
import { BiPolygon } from "react-icons/bi";
import { HiOutlineArrowRight } from "react-icons/hi";
import { IoText, IoSquareOutline } from "react-icons/io5";
import { MdOutlinePolyline } from "react-icons/md";
import { TbCircle, TbLine } from "react-icons/tb";
import Toolbar from "./Toolbars/Toolbar";
import MobileMenu from "./MobileMenu";
export default function ViewPort(props: {
  pdfUrl: string;
  pdfId: string;
  pdfPage?: number;
}) {
  const { provides: annotationApi } = useAnnotationCapability();
  const { provides: loaderApi } = useDocumentManagerCapability();
  const annotRef = useRef(false);
  const [fetchingPdf, setFetchingPdf] = useState<boolean>(true);
  const doneRecall = useRef<boolean>(false);
  useEffect(() => {
    if (!loaderApi||!fetchingPdf) return;
    getPdf(props.pdfId).then(async (pdfData) => {
      let doc = null;
      if (pdfData) {
        doc = await loaderApi
          .openDocumentBuffer({
            documentId: props.pdfId,
            buffer: pdfData.data,
            name: props.pdfId,
          })
          .toPromise();
        updateBookLastAccess({ bookId: props.pdfId });
      } else {
        doc = await loaderApi
          .openDocumentUrl({
            url: props.pdfUrl,
            documentId: props.pdfId,
          })
          .toPromise();
      }

      loaderApi.setActiveDocument(doc.documentId);
      setFetchingPdf(false);
    });
  }, [loaderApi, props.pdfId, props.pdfPage, props.pdfUrl]);

  if (fetchingPdf) {
    return <p> Pdf Is being fetched, Please Wait </p>;
  } else {
    return (
      <GlobalPointerProvider documentId={props.pdfId}>
        <DocumentContent documentId={props.pdfId}>
          {({ isLoading, isError, isLoaded }) => {
            if (isLoading) return <p> Pdf fetched, loading...</p>;
            if (isError) return <p>Error opening pdf file</p>;
            if (isLoaded)
              return (
                <Box className="relative h-full w-full overflow-hidden bg-[#ededed]">
                  <Viewport
                    documentId={props.pdfId}
                    onClick={() => {
                      if (annotationApi && annotRef.current) {
                        if (annotationApi.getSelectedAnnotation()) {
                          annotationApi.deselectAnnotation();
                          annotRef.current = false;
                        }
                      }
                    }}
                    draggable={false}
                    onDragStart={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Scroller
                      documentId={props.pdfId}
                      renderPage={({ width, height, pageIndex }) => (
                        <ContextMenu annotationApi={annotationApi!}>
                          <PageRender
                            documentId={props.pdfId}
                            width={width}
                            height={height}
                            pageIndex={pageIndex}
                            annotRef={annotRef}
                          />
                        </ContextMenu>
                      )}
                    />
                  </Viewport>
                  {!doneRecall.current && (
                    <ScrollToPageOnLoad
                      documentId={props.pdfId}
                      initialPage={
                        props.pdfPage
                          ? props.pdfPage > 1
                            ? props.pdfPage
                            : 1
                          : localStorage.getItem("LP_" + props.pdfId)
                            ? Number(localStorage.getItem("LP_" + props.pdfId))
                            : 1
                      }
                      doneRecall={doneRecall}
                    />
                  )}
                  <MobileMenu children={<Toolbar />} />
                </Box>
              );
          }}
        </DocumentContent>
      </GlobalPointerProvider>
    );
  }
}
const ScrollToPageOnLoad = ({
  documentId,
  initialPage,
  doneRecall,
}: {
  documentId: string;
  initialPage: number;
  doneRecall: React.MutableRefObject<boolean>;
}) => {
  const { provides: scrollCapability } = useScrollCapability();

  useEffect(() => {
    if (!scrollCapability) return;
    const unsubscribe = scrollCapability.onLayoutReady((event) => {
      if (doneRecall.current) return;
      if (event.documentId === documentId) {
        scrollCapability.forDocument(documentId).scrollToPage({
          pageNumber: initialPage,
          behavior: "instant",
        });
        doneRecall.current = true;
        unsubscribe();
      }
    });

    return unsubscribe;
  }, [scrollCapability, documentId, initialPage]);

  return null;
};
const ContextMenu = (props: {
  children: ReactElement;
  annotationApi: AnnotationCapability;
}) => {
  return (
    <Menu.Root>
      <Menu.ContextTrigger width="fit-content" height={"fit-content"}>
        {props.children}
      </Menu.ContextTrigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content width={"fit"} height={"fit"}>
            <HStack gap={0}>
              <StyledButton
                tooltip={"Highlight"}
                onClick={() => toggleTool("highlight", props.annotationApi)}
                children={<PiHighlighter />}
              />
              <StyledButton
                tooltip={"Underline"}
                onClick={() => toggleTool("underline", props.annotationApi)}
                children={<PiTextUnderline />}
              />
              <StyledButton
                tooltip={"Squiggly"}
                onClick={() => toggleTool("squiggly", props.annotationApi)}
                children={<PiScribble />}
              />
            </HStack>
            <HStack gap={0}>
              <StyledButton
                tooltip={"Pen"}
                onClick={() => toggleTool("ink", props.annotationApi)}
                children={<PiPen />}
              />
              <StyledButton
                tooltip={"Ink Highlighter"}
                onClick={() =>
                  toggleTool("inkHighlighter", props.annotationApi)
                }
                children={<PiHighlighterThin />}
              />
            </HStack>
            <HStack gap={0}>
              <StyledButton
                tooltip={"Free Text"}
                onClick={() => toggleTool("freeText", props.annotationApi)}
                children={<IoText />}
              />
            </HStack>

            <HStack gap={0}>
              <StyledButton
                tooltip={"Square"}
                onClick={() => toggleTool("square", props.annotationApi)}
                children={<IoSquareOutline />}
              />

              <StyledButton
                tooltip={"Circle"}
                onClick={() => toggleTool("circle", props.annotationApi)}
                children={<TbCircle />}
              />
              <StyledButton
                tooltip={"Polygon"}
                onClick={() => toggleTool("polygon", props.annotationApi)}
                children={<BiPolygon />}
              />
            </HStack>
            <HStack gap={0}>
              <StyledButton
                tooltip={"Line"}
                onClick={() => toggleTool("line", props.annotationApi)}
                children={<TbLine />}
              />
              <StyledButton
                tooltip={"Arrow"}
                onClick={() => toggleTool("lineArrow", props.annotationApi)}
                children={<HiOutlineArrowRight />}
              />
              <StyledButton
                tooltip={"Polyline"}
                onClick={() => toggleTool("polyline", props.annotationApi)}
                children={<MdOutlinePolyline />}
              />
            </HStack>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
function toggleTool(toolId: string, annotationApi: AnnotationCapability) {
  const activeTool = annotationApi?.getActiveTool()?.id;
  if (activeTool == toolId) {
    annotationApi?.setActiveTool(null);
  } else {
    annotationApi?.setActiveTool(toolId);
  }
}
function StyledButton(props: {
  children: ReactElement;
  onClick: () => void;
  tooltip: string;
  disabled?: boolean;
}) {
  const { provides: annotationApi } = useAnnotationCapability();
  return (
    <Menu.Item
      value={props.tooltip}
      width={"fit-content"}
      height={"fit-content"}
    >
      <Button
        disabled={props.disabled}
        variant={"outline"}
        size={"2xs"}
        backgroundColor={
          annotationApi?.getActiveTool()?.name == props.tooltip
            ? "gray.400"
            : ""
        }
        onClick={() => {
          props.onClick();
        }}
      >
        <Tooltip content={props.tooltip}>{props.children}</Tooltip>
      </Button>
    </Menu.Item>
  );
}
