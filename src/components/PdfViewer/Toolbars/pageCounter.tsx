import { Input, Span, Stack } from "@chakra-ui/react";
import { useScroll } from "@embedpdf/plugin-scroll/react";
import { useDebounce } from "./useDebounce";
import { useEffect, useState } from "react";
import { useActiveDocument } from "@embedpdf/plugin-document-manager/react";
import { useParams } from "react-router-dom";

export default function PageCounter() {
  const { activeDocumentId } = useActiveDocument();
  const { provides: scrollApi } = useScroll(activeDocumentId!);
  const [input, setInput] = useState<number | null>(0);
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
  const totalPages = scrollApi?.getTotalPages();
  const curPage = scrollApi?.getCurrentPage();
  if (totalPages && totalPages != 0)
    return (
      <Stack direction={"row"} align={"center"} justify={"center"}>
        <Input
          width={
            totalPages < 10
              ? "1.3rem"
              : totalPages < 100
                ? "2.3rem"
                : totalPages < 1000
                  ? "3.3rem"
                  : totalPages < 10000
                    ? "4.3rem"
                    : "5.3rem"
          }
          height={"1.5rem"}
          fontSize={"md"}
          placeholder={String(curPage)}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              setInput(Number(e.currentTarget.value));
              e.currentTarget.value = "";
            }
          }}
        />
        <Span>/ {totalPages}</Span>
      </Stack>
    );
}
