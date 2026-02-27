import {  HStack, Stack } from "@chakra-ui/react";
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
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  if (!activeDocumentId) return null;
  return (
    <Stack
      direction={{ base: "column", lg: "row" }}
      gap={"1rem"}
      background={"#ffffff"}
      margin={"0.5rem"}
      overflowY={"scroll"}
      maxH={"10rem"}
      align={"center"}
      justify={{ base: "normal", lg: "center" }}
    >
      {isTouchDevice ? (
        <>
          <SearchBar />
          <ZoomToolbar />
          <HStack>
            <AnnotationToolBar />
            <SaveToLocal />
          </HStack>
          <PageCounter />
          <HStack>
            <ExportToolbar />
            <PanToolbar />
            <ZoneCapture />
          </HStack>
          <RotateToolbar />
        </>
      ) : (
        <>
          <SearchBar />
          <ZoomToolbar />
          <PanToolbar />
          <RotateToolbar />
          <PageCounter />
          <ZoneCapture />
          <ExportToolbar />
          <SaveToLocal />
          <AnnotationToolBar />
        </>
      )}
    </Stack>
  );
}
