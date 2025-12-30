import {
  SelectionSelectionContext,
  useSelectionCapability,
} from "@embedpdf/plugin-selection/react";
import { useContext } from "react";
import {
  PdfAnnotationSubtype,
  PdfPopupAnnoObject,
  PdfZoomMode,
} from "@embedpdf/models";
import { Button, Stack } from "@chakra-ui/react";
import { CiBookmarkPlus } from "react-icons/ci";
import { BsClipboard2 } from "react-icons/bs";
import { Tooltip } from "../../ui/tooltip";
import { useZoom } from "@embedpdf/plugin-zoom/react";
import { bookmarkContext } from "./Store/BookmarkContext";
import { useActiveDocument } from "@embedpdf/plugin-document-manager/react";
import { getLastAddedItem } from "./tools";
import type { SelectionMenuPropsBase } from "@embedpdf/utils/react";
import { BiHighlight } from "react-icons/bi";
import { useAnnotationCapability } from "@embedpdf/plugin-annotation/react";
import { v4 as uuidv4 } from "uuid";
export default function SelectionMenu(
  props: SelectionMenuPropsBase<SelectionSelectionContext>
) {
  const { provides: selectionApi } = useSelectionCapability();
  const { provides: annotationApi } = useAnnotationCapability();
  const { activeDocumentId } = useActiveDocument();
  const { provides: zoomApi } = useZoom(activeDocumentId!);
  const { setBookmarks, bookmarks } = useContext(bookmarkContext);
  const { menuWrapperProps, selected } = props;
  const zoomlevel = zoomApi?.getState().currentZoomLevel || 1;

  if (selected) {
    return (
      <Stack
        position={"absolute"}
        zIndex={2}
        padding={1}
        top={
          Number(menuWrapperProps.style.top) +
          Number(menuWrapperProps.style.height) +
          "px"
        }
        left={
          Number(menuWrapperProps.style.left) +
          Number(menuWrapperProps.style.width) / 2 +
          "px"
        }
        width={"fit-content"}
        height={"fit-content"}
        direction={"row"}
        gap={1}
        background={"gray.100"}
        align={"center"}
        justify={"center"}
      >
        <Button
          data-selection-menu
          size={"2xs"}
          variant={"subtle"}
          background={"gray.200"}
          onMouseDown={() => {
            if (selectionApi) {
              selectionApi.copyToClipboard();
              selectionApi
                .getSelectedText()
                .toPromise()
                .then((text) => console.log("".concat(...text)));
            }
          }}
        >
          <Tooltip content="copy to clipboard">
            <BsClipboard2 />
          </Tooltip>
        </Button>
        <Button
          data-selection-menu
          size={"2xs"}
          variant={"subtle"}
          background={"gray.200"}
          onClick={() => {
            const selection = selectionApi?.getFormattedSelection()[0];
            if (!selection) return;
            selectionApi
              ?.getSelectedText()
              .toPromise()
              .then((text) =>
                setBookmarks([
                  {
                    bookmarkDetails: {
                      title: "".concat(...text),
                      target: {
                        type: "destination",
                        destination: {
                          pageIndex: selection.pageIndex + 1,
                          view: [
                            selection.rect.origin.x,
                            selection.rect.origin.y,
                          ],
                          zoom: {
                            mode: PdfZoomMode.XYZ,
                            params: {
                              x: selection.rect.origin.x,
                              y: selection.rect.origin.y,
                              zoom: zoomlevel,
                            },
                          },
                        },
                      },
                    },
                    preSibId:
                      bookmarks.length > 0 ? getLastAddedItem(bookmarks) : null,
                    parentId: null,
                  },
                ])
              );
          }}
        >
          <Tooltip content="Bookmark">
            <CiBookmarkPlus />
          </Tooltip>
        </Button>
        <Button
          data-selection-menu
          size={"2xs"}
          variant={"subtle"}
          background={"gray.200"}
          onClick={() => {
            if (!selectionApi || !annotationApi) return;
            const selectedRect = selectionApi.getFormattedSelection();
            const activeTool = annotationApi.getTool("highlight");
            if (!activeTool || activeTool.defaults.type != 9) return;
            const color = activeTool.defaults.color;
            const opacity = activeTool.defaults.opacity;
            selectedRect.forEach((select) => {
              selectionApi
                .getSelectedText()
                .toPromise()
                .then((text) => {
                  const highlightId = uuidv4();
                  annotationApi.createAnnotation(select.pageIndex, {
                    type: PdfAnnotationSubtype.HIGHLIGHT,
                    rect: select.rect,
                    pageIndex: select.pageIndex,
                    flags: ["print"],
                    custom: { text: text },
                    segmentRects: select.segmentRects,
                    color: color!,
                    opacity: opacity!,
                    id: highlightId,
                  });
                  annotationApi.createAnnotation(select.pageIndex, {
                    type: PdfAnnotationSubtype.POPUP,
                    contents: "zzzzzzzzz",
                    rect: select.rect,
                    id: uuidv4(),
                  } as PdfPopupAnnoObject);
                });
            });
          }}
        >
          <Tooltip content="Highlight">
            <BiHighlight />
          </Tooltip>
        </Button>
      </Stack>
    );
  }
}
