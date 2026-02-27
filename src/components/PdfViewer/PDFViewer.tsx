import { EmbedPDF } from "@embedpdf/core/react";
import { PdfEngineProvider, usePdfiumEngine } from "@embedpdf/engines/react";
import { plugins } from "./plugins";
import ViewPort from "./ViewPort";
import { Box, Stack } from "@chakra-ui/react";
import Toolbar from "./Toolbars/Toolbar";
import Sidebar from "./Sidebars/Sidebar";
import BookmarkContextProvider from "./Store/BookmarkContextProvider";
export default function PDFViewer(props: {
  pdfUrl: string;
  pdfId: string;
  pdfPage?: number;
}) {
  const { engine, isLoading, error } = usePdfiumEngine();
  if (isLoading || !engine) {
    return <div>Loading PDF Engine...</div>;
  } else {
    return (
      <PdfEngineProvider engine={engine} isLoading={isLoading} error={error}>
        <EmbedPDF engine={engine} plugins={plugins}>
          <BookmarkContextProvider>
            <Stack position={"absolute"} inset={0} direction={"column"} gap={0}>
              <Box display={{ base: "none", lg: "block" }}>
                <Toolbar />
              </Box>
              <Stack direction={"row"} flex={1} minHeight={0} gap={0}>
                <Box display={{ base: "none", md: "block" }}>
                  <Sidebar />
                </Box>
                <Box flex={1} minWidth={0}>
                  <ViewPort
                    pdfId={props.pdfId}
                    pdfUrl={props.pdfUrl}
                    pdfPage={props.pdfPage}
                  />
                </Box>
              </Stack>
            </Stack>
          </BookmarkContextProvider>
        </EmbedPDF>
      </PdfEngineProvider>
    );
  }
}
