import { Button, Input, Span, Stack } from "@chakra-ui/react";
import {
  SearchDocumentState,
  useSearchCapability,
} from "@embedpdf/plugin-search/react";
import { useEffect, useRef, useState } from "react";
import { MatchFlag, SearchAllPagesResult } from "@embedpdf/models";
import { HiSearch } from "react-icons/hi";
import { useScrollCapability } from "@embedpdf/plugin-scroll/react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { MdOutlineCancel } from "react-icons/md";
export default function SearchBar() {
  const { provides: searchApi } = useSearchCapability();
  const { provides: scrollApi } = useScrollCapability();
  const [found, setFound] = useState<SearchAllPagesResult>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchState, setSearchState] = useState<SearchDocumentState>();
  useEffect(() => {
    if (!searchApi || !scrollApi) return;
    searchApi.setFlags([MatchFlag.MatchConsecutive]);
    const unsub1 = searchApi.onActiveResultChange((ar) => {
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
    });
    const unsub = searchApi.onSearchResult((ev) => {
      if (ev.results.total > 0) {
        searchApi.goToResult(0);
      }
    });
    return () => {
      unsub();
      unsub1();
    };
  }, [found, scrollApi, searchApi]);
  useEffect(() => {
    if (!searchApi) return;
    return searchApi.onStateChange((ev) => {
      if (ev.state.loading == false) {
        setSearchState(ev.state);
      }
    });
  }, [searchApi]);

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
              searchState?.active && searchState.total == 0 ? "red.200" : ""
            }
          />
          {searchState &&
            searchState.activeResultIndex != -1 &&
            searchState.results.length > 0 && (
              <Span>
                {searchState?.activeResultIndex + 1}/{searchState?.total}
              </Span>
            )}
        </Stack>

        {searchState?.active && (
          <MdOutlineCancel
            onClick={() => {
              searchApi?.stopSearch();
              if (inputRef.current) {
                inputRef.current.value = "";
              }
            }}
            cursor={"pointer"}
          />
        )}
        <GrPrevious
          cursor={"pointer"}
          onClick={() => {
            searchApi?.previousResult();
          }}
        />
        <GrNext
          cursor={"pointer"}
          onClick={() => {
            searchApi?.nextResult();
          }}
        />
      </Stack>
      <Button
        variant={"outline"}
        size={"2xs"}
        onClick={() => {
          if (inputRef.current?.value) {
            searchApi
              ?.searchAllPages(inputRef.current?.value)
              .toPromise()
              .then((res) => {
                setFound(res);
              });
          }
        }}
      >
        <HiSearch />
      </Button>
    </Stack>
  );
}
