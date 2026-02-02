import { Stack } from "@chakra-ui/react";
import AnnotationToolBar from "./Annotation";
import ZoomToolbar from "./Zoom";
import RotateToolbar from "./Rotate";
import ExportToolbar from "./Export";
import PageCounter from "./pageCounter";
import PanToolbar from "./Pan";
import SearchBar from "./Search";
import ZoneCapture from "./ZoneCapture";
import { useActiveDocument } from "@embedpdf/plugin-document-manager/react";
import SaveToLocal from "./SaveToLocal";

export default function Toolbar() {
  const { activeDocumentId } = useActiveDocument();

  if (!activeDocumentId) return <p>still waiting</p>;
  return (
    <Stack
      direction={"row"}
      justify={"center"}
      align={"center"}
      gap={"1"}
      background={"#ffffff"}
      marginTop="1"
      marginBottom={"2"}
    >
      <SearchBar />
      <ZoomToolbar />
      <PanToolbar />
      <ZoneCapture />
      <PageCounter />
      <RotateToolbar />
      <ExportToolbar />
      <SaveToLocal />
      <AnnotationToolBar />
    </Stack>
  );
}
