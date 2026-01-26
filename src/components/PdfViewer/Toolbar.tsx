import { Span, Stack } from "@chakra-ui/react";
import AnnotationToolBar from "./Toolbars/Annotation";
import ZoomToolbar from "./Toolbars/Zoom";
import RotateToolbar from "./Toolbars/Rotate";
import ExportToolbar from "./Toolbars/Export";
import {
  AnnotationTool,
  useAnnotationCapability,
} from "@embedpdf/plugin-annotation/react";
import { useEffect, useState } from "react";
import PageCounter from "./Toolbars/pageCounter";
import PanToolbar from "./Toolbars/Pan";
import SearchBar from "./Toolbars/Search";
import { Color, PropertySlider } from "./AnnotationProperties";
import ZoneCapture from "./Toolbars/ZoneCapture";
import { useActiveDocument } from "@embedpdf/plugin-document-manager/react";
import SaveToLocal from "./Toolbars/SaveToLocal";

export default function Toolbar() {
  const { activeDocumentId } = useActiveDocument();
  const { provides: annotationApi } = useAnnotationCapability();
  const [activeTool, setActiveTool] = useState<AnnotationTool | null>(null);
  useEffect(() => {
    if (!annotationApi) return;
    return annotationApi.onActiveToolChange((ev) => {
      setActiveTool(ev.tool);
    });
  }, [annotationApi]);
  if (!activeDocumentId) return <p>still waiting</p>;
  return (
    <Stack direction={"column"} gap={"0"} background={"#ffffff"}>
      <Stack
        direction={"row"}
        height={"4vh "}
        justify={"center"}
        align={"center"}
      >
        <SearchBar />
        <ZoomToolbar />
        <PanToolbar />
        <ZoneCapture />
        <PageCounter />
        <RotateToolbar />
        <ExportToolbar />
        <SaveToLocal />
      </Stack>
      <Stack
        direction={"row"}
        height={"4vh "}
        justify={"center"}
        align={"center"}
      >
        <AnnotationToolBar />
      </Stack>
      <Stack
        justify={"center"}
        align={"center"}
        direction={"row"}
        gap={"3vw"}
        maxWidth={"150vw"}
      >
        {activeTool?.defaults.type == 9 && (
          <Stack direction={"row"} align={"center"}>
            <Color
              type="create"
              colorType="color"
              defaultValue={activeTool.defaults.color!}
            />
            <Stack direction={"column"} align={"center"} gap={0}>
              <Span>Opacity : </Span>
              <PropertySlider
                property="opacity"
                type="create"
                defaultValue={activeTool.defaults.opacity!}
              />
            </Stack>
          </Stack>
        )}
        {activeTool?.defaults.type == 15 &&
          activeTool.defaults.intent != "InkHighlight" && (
            <Stack direction={"row"} align={"center"}>
              <Color
                type="create"
                colorType="color"
                defaultValue={activeTool.defaults.color!}
              />
              <Stack direction={"column"} align={"center"} gap={0}>
                <Span>Opacity : </Span>
                <PropertySlider
                  property="opacity"
                  type="create"
                  defaultValue={activeTool.defaults.opacity!}
                />
              </Stack>
              <Stack direction={"column"} align={"center"} gap={0}>
                <Span>Stroke width : </Span>
                <PropertySlider
                  property="strokeWidth"
                  type="create"
                  ratio={5}
                  defaultValue={activeTool.defaults.strokeWidth!}
                />
              </Stack>
            </Stack>
          )}
        {activeTool?.defaults.type == 10 && (
          <Stack direction={"row"} align={"center"}>
            <Color
              type="create"
              colorType="color"
              defaultValue={activeTool.defaults.color!}
            />
            <Stack direction={"column"} align={"center"} gap={0}>
              <Span>Opacity : </Span>
              <PropertySlider
                property="opacity"
                type="create"
                defaultValue={activeTool.defaults.opacity!}
              />
            </Stack>
          </Stack>
        )}
        {activeTool?.defaults.type == 11 && (
          <Stack direction={"row"} align={"center"}>
            <Color
              type="create"
              colorType="color"
              defaultValue={activeTool.defaults.color!}
            />
            <Stack direction={"column"} align={"center"} gap={0}>
              <Span>Opacity : </Span>
              <PropertySlider
                property="opacity"
                type="create"
                defaultValue={activeTool.defaults.opacity!}
              />
            </Stack>
          </Stack>
        )}
        {activeTool?.defaults.type == 15 &&
          activeTool.defaults.intent == "InkHighlight" && (
            <Stack direction={"row"} align={"center"}>
              <Color
                type="create"
                colorType="color"
                defaultValue={activeTool.defaults.color!}
              />
              <Stack direction={"column"} align={"center"} gap={0}>
                <Span>Opacity : </Span>
                <PropertySlider
                  property="opacity"
                  type="create"
                  defaultValue={activeTool.defaults.opacity!}
                />
              </Stack>
            </Stack>
          )}
      </Stack>
    </Stack>
  );
}
