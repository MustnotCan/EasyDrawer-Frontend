import { EmbedPDF } from "@embedpdf/core/react";
import { PdfEngineProvider, usePdfiumEngine } from "@embedpdf/engines/react";
import { plugins } from "./plugins";
import ViewPort from "./ViewPort";
import { Box, Stack } from "@chakra-ui/react";
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";
import { GlobalPointerProvider } from "@embedpdf/plugin-interaction-manager/react";
import { useBookmarks } from "../../utils/Hooks/BookmarkHook";
import BookmarkContextProvider from "./Store/BookmarkContextProvider";
export default function PDFViewer(props: {
  pdfUrl: string;
  pdfId: string;
  pdfPage?: number;
}) {
  const { engine, isLoading, error } = usePdfiumEngine();
  const { data, setBookmarksMutation, removeBookmarkMutation } = useBookmarks({
    bookId: props.pdfId,
  });
  if (isLoading || !engine) {
    return <div>Loading PDF Engine...</div>;
  } else {
    return (
      <PdfEngineProvider engine={engine} isLoading={isLoading} error={error}>
        <EmbedPDF engine={engine} plugins={plugins}>
          <BookmarkContextProvider
            bookId={props.pdfId}
            bookmarks={data}
            setBookmarksMutation={setBookmarksMutation}
            removeBookmarkMutation={removeBookmarkMutation}
          >
            <Stack
              position={"absolute"}
              left={0}
              right={0}
              top={0}
              bottom={0}
              direction={"column"}
              gap={0}
            >
              <Toolbar />
              <Stack minHeight={0} direction={"row"} gap={0}>
                <Sidebar />
                <Box flex={1} minWidth={0} overflowX="auto">
                  <GlobalPointerProvider documentId={props.pdfId}>
                    <ViewPort
                      pdfId={props.pdfId}
                      pdfUrl={props.pdfUrl}
                      pdfPage={props.pdfPage}
                    />
                  </GlobalPointerProvider>
                </Box>
              </Stack>
            </Stack>
          </BookmarkContextProvider>
        </EmbedPDF>
      </PdfEngineProvider>
    );
  }
}
