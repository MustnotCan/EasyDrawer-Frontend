import { Span } from "@chakra-ui/react";
import {
  SearchDocumentState,
  useSearchCapability,
} from "@embedpdf/plugin-search/react";
import { useZoom } from "@embedpdf/plugin-zoom/react";
import { useActiveDocument } from "@embedpdf/plugin-document-manager/react";
import { useEffect, useState } from "react";
export default function SearchResultOverlay(props: { pageIndex: number }) {
  const { activeDocumentId } = useActiveDocument();
  const { provides: searchApi } = useSearchCapability();
  const { state: zoomState } = useZoom(activeDocumentId!);
  const [searchState, setSearchState] = useState<SearchDocumentState | null>(
    null
  );

  useEffect(() => {
    if (!searchApi) return;
    searchApi.onStateChange((state) => {
      setSearchState(state.state);
    });
  }, [searchApi]);
  if (!searchState) return;
  const { loading, activeResultIndex, results, active } = searchState;
  const actualZoom = zoomState.currentZoomLevel;
  if (
    results.length > 0 &&
    props.pageIndex == results[activeResultIndex].pageIndex &&
    !loading &&
    active
  ) {
    const initial_x = results[activeResultIndex].rects[0].origin.x;
    const initial_y = results[activeResultIndex].rects[0].origin.y;
    const initial_width = results[activeResultIndex].rects[0].size.width;
    const initial_height = results[activeResultIndex].rects[0].size.height;

    const position = results[activeResultIndex].rects.reduce(
      (prev, curr) => {
        curr.origin.x = Math.max(curr.origin.x, prev.origin.x);
        curr.origin.y = Math.max(curr.origin.y, prev.origin.y);
        curr.size.height = Math.max(curr.size.height, prev.size.height);
        curr.size.width = Math.max(curr.size.width, prev.size.width);
        return curr;
      },
      {
        origin: { x: initial_x, y: initial_y },
        size: { height: initial_height, width: initial_width },
      }
    );
    return (
      <Span
        position={"absolute"}
        top={position.origin.y * actualZoom + "px"}
        left={position.origin.x * actualZoom + "px"}
        height={position.size.height * actualZoom + "px"}
        width={position.size.width * actualZoom + "px"}
        background="rgba(190, 227, 248, 0.5)"
      ></Span>
    );
  } else {
    return <></>;
  }
}
