import { AnnotationLayer } from "@embedpdf/plugin-annotation/react";
import { PagePointerProvider } from "@embedpdf/plugin-interaction-manager/react";
import { RenderLayer } from "@embedpdf/plugin-render/react";
import { Rotate } from "@embedpdf/plugin-rotate/react";
import { SelectionLayer } from "@embedpdf/plugin-selection/react";
import { TilingLayer } from "@embedpdf/plugin-tiling/react";
import { MarqueeZoom } from "@embedpdf/plugin-zoom/react";
import LinksClicker from "./LinksClicker";
import AnnotationSelectionMenu from "./AnnotationSelectionMenu";
import AnnotationLayerUpdated from "./AnnotationLayerUpdated";
import AnnotationContextProvider from "./Store/AnnotationContextProvider";
import SelectionMenu from "./SelectionMenu";
import SearchResultOverlay from "./SearchResultOverlay";
import { MarqueeCapture } from "@embedpdf/plugin-capture/react";

export default function PageRender(props: {
  width: number;
  height: number;
  pageIndex: number;
  annotRef: { current: boolean };
  documentId: string;
}) {
  return (
    <Rotate
      documentId={props.documentId}
      pageIndex={props.pageIndex}
      style={{ overflowX: "auto", overflow: "clip" }}
    >
      <PagePointerProvider
        documentId={props.documentId}
        {...{
          width: props.width,
          height: props.height,
          pageIndex: props.pageIndex,
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <RenderLayer
          pageIndex={props.pageIndex}
          documentId={props.documentId}
        />
        <TilingLayer
          pageIndex={props.pageIndex}
          documentId={props.documentId}
        />
        <MarqueeCapture
          pageIndex={props.pageIndex}
          documentId={props.documentId}
        />
        <MarqueeZoom
          pageIndex={props.pageIndex}
          documentId={props.documentId}
        />
        <SelectionLayer
          pageIndex={props.pageIndex}
          documentId={props.documentId}
          selectionMenu={(props) => <SelectionMenu {...props} />}
        />
        <AnnotationContextProvider
        >
          <AnnotationLayer
            documentId={props.documentId}
            pageIndex={props.pageIndex}
            selectionMenu={(props) => <AnnotationSelectionMenu {...props} />}
            onClick={(e) => {
              props.annotRef.current = true;
              e.stopPropagation();
            }}
          />
          <AnnotationLayerUpdated pageIndex={props.pageIndex} />
        </AnnotationContextProvider>

        <LinksClicker pageIndex={props.pageIndex} />
        <SearchResultOverlay pageIndex={props.pageIndex} />
      </PagePointerProvider>
    </Rotate>
  );
}
