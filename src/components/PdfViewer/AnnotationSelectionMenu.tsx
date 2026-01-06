import { Button, Stack } from "@chakra-ui/react";
import { PdfZoomMode } from "@embedpdf/models";
import {
  AnnotationSelectionContext,
  useAnnotationCapability,
} from "@embedpdf/plugin-annotation/react";
import type { SelectionMenuPropsBase } from "@embedpdf/utils/react";
import { useContext } from "react";
import { MdDelete, MdBookmarkAdd } from "react-icons/md";
import { annotationContext } from "./Store/AnnotationContext";
import { Tooltip } from "../../ui/tooltip";
import { bookmarkContext } from "./Store/BookmarkContext";
import { useZoomCapability } from "@embedpdf/plugin-zoom/react";
import { getLastAddedItem } from "./tools";
export default function AnnotationSelectionMenu(
  props: SelectionMenuPropsBase<AnnotationSelectionContext>
) {
  const { menuWrapperProps, selected, context } = props;
  const { provides: annotationApi } = useAnnotationCapability();
  const { provides: zoomApi } = useZoomCapability();
  const { removeAnnot } = useContext(annotationContext);
  const { setBookmarks, bookmarks } = useContext(bookmarkContext);
  const zoomlevel = zoomApi?.getState().currentZoomLevel || 1;
  if (!annotationApi) return <p>Annotation api unavailable</p>;
  const annotation = annotationApi.getSelectedAnnotation();
  if (!annotation) return;
  if (selected)
    return (
      <Stack
        direction="row"
        position={"absolute"}
        top={
          Number(menuWrapperProps.style.top) +
          Number(menuWrapperProps.style.height) +
          "px"
        }
        width={"fit-content"}
        height={"fit-content"}
        left={
          Number(menuWrapperProps.style.left) +
          Number(menuWrapperProps.style.width) / 2 +
          "px"
        }
        background={"gray.200"}
        padding={1}
      >
        <Button
          size="2xs"
          variant="subtle"
          onClick={() => {
            const selectedAnnot = annotation;
            if (selectedAnnot) {
              removeAnnot(selectedAnnot.object.id);
              annotationApi.deleteAnnotation(
                selectedAnnot.object.pageIndex,
                selectedAnnot.object.id
              );
            }
          }}
        >
          <MdDelete />
        </Button>
        {
          <Button
            data-selection-menu
            size={"2xs"}
            variant={"subtle"}
            onClick={() => {
              const x = context.annotation.object.rect.origin.x;
              const y = context.annotation.object.rect.origin.y;
              setBookmarks([
                {
                  bookmarkDetails: {
                    title:
                      annotation.object.custom && annotation.object.custom.text
                        ? annotation.object.custom.text
                        : "new bookmark",
                    target: {
                      type: "destination",
                      destination: {
                        pageIndex: context.pageIndex + 1,
                        view: [x, y],
                        zoom: {
                          mode: PdfZoomMode.XYZ,
                          params: {
                            x: x,
                            y: y,
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
              ]);
            }}
          >
            <Tooltip content="Bookmark">
              <MdBookmarkAdd />
            </Tooltip>
          </Button>
        }
      </Stack>
    );
}
