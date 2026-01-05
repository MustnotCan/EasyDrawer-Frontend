import { Button, Input, Span, Spinner, Stack } from "@chakra-ui/react";
import {
  SearchDocumentState,
  useSearchCapability,
} from "@embedpdf/plugin-search/react";
import { useEffect, useRef, useState } from "react";
import {
  MatchFlag,
  SearchAllPagesResult,
  SearchResult,
} from "@embedpdf/models";
import { HiSearch } from "react-icons/hi";
import {
  ScrollCapability,
  useScrollCapability,
} from "@embedpdf/plugin-scroll/react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { MdOutlineCancel } from "react-icons/md";
const findIndex = (
  results: SearchResult[],
  scrollApi: ScrollCapability | null
) => {
  if (!scrollApi) return 0;
  let firstResIndex: number = results.findIndex(
    (res) => res.pageIndex >= scrollApi?.getCurrentPage() - 1
  );
  if (firstResIndex == -1) {
    firstResIndex = 0;
  }
  return firstResIndex;
};
export default function SearchBar() {
  const { provides: searchApi } = useSearchCapability();
  const { provides: scrollApi } = useScrollCapability();
  const [found, setFound] = useState<SearchAllPagesResult>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchState, setSearchState] = useState<SearchDocumentState>();

  useEffect(() => {
    if (!searchApi || !scrollApi) return;
    const unsub = searchApi.onSearchResult((ev) => {
      if (ev.results.total > 0) {
        const firstResIndex = findIndex(ev.results.results, scrollApi);
        searchApi.goToResult(firstResIndex);
      }
    });
    return unsub;
  }, [scrollApi, searchApi]);
  useEffect(() => {
    if (!searchApi || !scrollApi) return;
    return searchApi.onStateChange((ev) => {
      setSearchState(ev.state);
      if (ev.state.loading == false) {
        const activeResultIndex = ev.state.activeResultIndex;
        const ar = { index: activeResultIndex };
        if (found && found.results[ar.index]) {
          const x = found?.results[ar.index].rects[0].origin.x;
          const y = found?.results[ar.index].rects[0].origin.y;
          scrollApi?.scrollToPage({
            pageNumber: found?.results[ar.index].pageIndex + 1,
            behavior: "instant",
            pageCoordinates: {
              x: x > 0 ? x : 0,
              y: y > 0 ? y : 0,
            },
          });
        }
      }
    });
  }, [found, scrollApi, searchApi]);

  const startSearch = () => {
    if (!searchApi) return;
    if (!searchApi.getFlags().includes(MatchFlag.MatchConsecutive)) {
      searchApi.setFlags([MatchFlag.MatchConsecutive]);
    }
    const input = inputRef.current?.value;
    if (input) {
      searchApi
        ?.searchAllPages(input)
        .toPromise()
        .then((res) => {
          setFound(res);
          if (res.total > 0) {
            const firstResIndex = findIndex(res.results, scrollApi);
            searchApi.goToResult(firstResIndex);
          }
        });
    }
  };

  return (
    <Stack direction={"row"} justify={"center"} align={"center"}>
      <Stack
        direction="row"
        justify="center"
        align="center"
        border={2}
        borderColor={"black"}
        borderStyle={"groove"}
      >
        <Stack direction={"row"}>
          <Input
            ref={inputRef}
            maxHeight={6}
            background={
              searchState?.active &&
              !searchState?.loading &&
              searchState.query == inputRef.current?.value &&
              searchState.total == 0
                ? "red.200"
                : ""
            }
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                startSearch();
              }
            }}
          />
          {searchState &&
            searchState.activeResultIndex != -1 &&
            searchState.results.length > 0 && (
              <Span>
                {searchState?.activeResultIndex + 1}/{searchState?.total}
              </Span>
            )}
        </Stack>
        {searchState?.loading && <Spinner size={"xs"} />}
        {searchState?.active && (
          <Button
            onClick={() => {
              searchApi?.stopSearch();
              if (inputRef.current) {
                inputRef.current.value = "";
              }
            }}
            cursor={"pointer"}
            variant={"outline"}
            size={"2xs"}
          >
            <MdOutlineCancel />
          </Button>
        )}
        <Button
          cursor={"pointer"}
          onClick={() => {
            searchApi?.previousResult();
          }}
          variant={"outline"}
          size={"2xs"}
        >
          <GrPrevious />
        </Button>
        <Button
          cursor={"pointer"}
          onClick={() => {
            searchApi?.nextResult();
          }}
          variant={"outline"}
          size={"2xs"}
        >
          <GrNext />
        </Button>
      </Stack>
      <Button
        variant={"outline"}
        size={"2xs"}
        onClick={() => {
          startSearch();
        }}
      >
        <HiSearch />
      </Button>
    </Stack>
  );
}
