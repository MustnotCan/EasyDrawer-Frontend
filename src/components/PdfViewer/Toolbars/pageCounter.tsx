import { Input, Span, Stack } from "@chakra-ui/react";
import { useScroll } from "@embedpdf/plugin-scroll/react";
import { useDebounce } from "./useDebounce";
import { useEffect, useState } from "react";
import { useActiveDocument } from "@embedpdf/plugin-document-manager/react";
import { useParams } from "react-router-dom";

export default function PageCounter() {
  const { activeDocumentId } = useActiveDocument();
  const { state, provides: scrollApi } = useScroll(activeDocumentId!);
  const [input, setInput] = useState<number | null>();
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedInput = useDebounce(input);
  const params = useParams();
  useEffect(() => {
    if (
      debouncedInput === null ||
      debouncedInput === currentPage ||
      !scrollApi
    ) {
      return;
    }

    scrollApi.scrollToPage({
      pageNumber: debouncedInput as number,
      behavior: "instant",
    });

    setInput(null);
  }, [debouncedInput, currentPage, scrollApi]);

  useEffect(() => {
    if (!scrollApi) return;
    return scrollApi.onPageChange((state) => {
      setCurrentPage(state.pageNumber);
      if (!params.page && params.path) {
        localStorage.setItem("LP_" + params.path, String(state.pageNumber));
      }
    });
  }, [params.page, params.path, scrollApi]);
  if (state.totalPages && state.totalPages != 0)
    return (
      <Stack direction={"row"} align={"center"} justify={"center"}>
        <Input
          width={"4vw"}
          size={"xs"}
          maxHeight={"2.5vh"}
          fontSize={"md"}
          placeholder={String(currentPage)}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              setInput(Number(e.currentTarget.value));
              e.currentTarget.value = "";
            }
          }}
        />
        <Span>/ {state.totalPages}</Span>
      </Stack>
    );
}
