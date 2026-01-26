import { EmbedPDF } from "@embedpdf/core/react";
import { PdfEngineProvider, usePdfiumEngine } from "@embedpdf/engines/react";
import { plugins } from "./plugins";
import ViewPort from "./ViewPort";
import { Box, Stack } from "@chakra-ui/react";
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";
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
