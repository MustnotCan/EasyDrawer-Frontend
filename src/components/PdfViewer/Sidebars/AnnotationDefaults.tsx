import { Stack, Span } from "@chakra-ui/react";
import {
  PropertySlider,
  Color,
  PropertySelecter,
  Transparent,
} from "../AnnotationProperties";
import {
  useAnnotationCapability,
  AnnotationTool,
} from "@embedpdf/plugin-annotation/react";
import { useState, useEffect } from "react";
import { PdfBlendMode, PdfAnnotationSubtype } from "@embedpdf/models";

export default function AnnotationDefaults() {
  const { provides: annotationApi } = useAnnotationCapability();
  const [activeTool, setActiveTool] = useState<AnnotationTool | null>(null);
  useEffect(() => {
    if (!annotationApi) return;
    return annotationApi.onActiveToolChange((ev) => {
      setActiveTool(ev.tool);
    });
  }, [annotationApi]);
  if (!activeTool) {
    return <p>No annotation tool selected</p>;
  } else {
    if (activeTool?.defaults?.type == PdfAnnotationSubtype.HIGHLIGHT) {
      return (
        <Stack direction={"column"} width={"10vw"} key={activeTool.id}>
          <Stack direction={"column"} align={"center"}>
            Color :
            <Color
              type="create"
              colorType="color"
              defaultValue={activeTool.defaults.color!}
            />
          </Stack>
          <Stack direction={"column"} align={"center"}>
            Opacity :
            <PropertySlider
              type="create"
              property="opacity"
              defaultValue={activeTool.defaults.opacity!}
            />
          </Stack>
          <Stack direction={"column"} align={"center"}>
            Blend mode :
            <PropertySelecter
              property="blendMode"
              defaultValue={PdfBlendMode[activeTool.defaults.blendMode!]}
              type="create"
              toolId="highlight"
            />
          </Stack>
        </Stack>
      );
    } else if (activeTool?.defaults?.type == PdfAnnotationSubtype.INK) {
      return (
        <Stack direction={"column"} width={"10vw"} key={activeTool.id}>
          <Stack direction={"column"} align={"center"}>
            Color :
            <Color
              type="create"
              colorType="color"
              defaultValue={activeTool.defaults.color!}
            />
          </Stack>
          <Stack direction={"column"} align={"center"}>
            Opacity :
            <PropertySlider
              type="create"
              property="opacity"
              defaultValue={activeTool.defaults.opacity!}
            />
          </Stack>
          <Stack direction={"column"} align={"center"}>
            Stroke width :
            <PropertySlider
              type="create"
              property="strokeWidth"
              ratio={6}
              defaultValue={activeTool.defaults.strokeWidth!}
            />
          </Stack>
        </Stack>
      );
    } else if (activeTool?.defaults?.type == PdfAnnotationSubtype.FREETEXT) {
      return (
        <Stack direction={"column"} width={"10vw"} key={activeTool.id}>
          <Stack direction={"column"} align={"center"}>
            Font color :
            <Color
              type="create"
              colorType="fontColor"
              defaultValue={activeTool.defaults.fontColor!}
            />
          </Stack>
          <Stack direction={"column"} align={"center"}>
            Opacity :
            <PropertySlider
              type="create"
              property="opacity"
              defaultValue={activeTool.defaults.opacity!}
            />
          </Stack>
          <Stack direction={"column"} align={"center"}>
            Font size :
            <PropertySlider
              type="create"
              property="fontSize"
              ratio={3}
              defaultValue={activeTool.defaults.fontSize!}
            />
          </Stack>
          <Stack direction={"column"} align={"center"}>
            Font family :
            <PropertySelecter
              property="fontFamily"
              defaultValue={activeTool.defaults.fontFamily!.toString()}
              type="create"
              toolId="freeText"
            />
          </Stack>
          <Stack direction={"column"} align={"center"}>
            Color type :
            <Transparent
              transparentType="backgroundColor"
              defaultValue={
                activeTool?.defaults.backgroundColor ?? "transparent"
              }
              color={activeTool.defaults.fontColor!}
              type="create"
            />
          </Stack>
          {activeTool?.defaults.backgroundColor != "transparent" && (
            <Stack direction={"column"} align={"center"}>
              Background color :
              <Color
                type="create"
                colorType="backgroundColor"
                defaultValue={
                  activeTool?.defaults.backgroundColor ?? "transparent"
                }
              />
            </Stack>
          )}
        </Stack>
      );
    } else if (activeTool?.defaults?.type == PdfAnnotationSubtype.UNDERLINE) {
      return (
        <Stack direction={"column"} width={"10vw"} key={activeTool.id}>
          <Stack direction={"column"} align={"center"}>
            Color :
            <Color
              type="create"
              colorType="color"
              defaultValue={activeTool.defaults.color!}
            />
          </Stack>
          <Stack direction={"column"} align={"center"}>
            Opacity :
            <PropertySlider
              type="create"
              property="opacity"
              defaultValue={activeTool.defaults.opacity!}
            />
          </Stack>
        </Stack>
      );
    } else if (activeTool?.defaults?.type == PdfAnnotationSubtype.SQUIGGLY) {
      return (
        <Stack direction={"column"} width={"10vw"} key={activeTool.id}>
          <Stack direction={"column"} align={"center"}>
            Color :
            <Color
              type="create"
              colorType="color"
              defaultValue={activeTool.defaults.color!}
            />
          </Stack>
          <Stack direction={"column"} align={"center"}>
            Opacity :
            <PropertySlider
              type="create"
              property="opacity"
              defaultValue={activeTool.defaults.opacity!}
            />
          </Stack>
        </Stack>
      );
    } else if (activeTool?.defaults?.type == PdfAnnotationSubtype.LINE) {
      return (
        <Stack direction={"column"} width={"10vw"} key={activeTool.id}>
          <Stack direction={"column"} align={"center"}>
            Color :
            <Color
              type="create"
              colorType="strokeColor"
              defaultValue={activeTool.defaults.strokeColor!}
            />
          </Stack>
          <Stack direction={"column"} align={"center"}>
            Opacity :
            <PropertySlider
              type="create"
              property="opacity"
              defaultValue={activeTool.defaults.opacity!}
            />
          </Stack>
          <Stack direction={"column"} align={"center"}>
            Stroke width :
            <PropertySlider
              type="create"
              property="strokeWidth"
              ratio={5}
              defaultValue={activeTool.defaults.strokeWidth!}
            />
          </Stack>
        </Stack>
      );
    } else if (
      [
        PdfAnnotationSubtype.CIRCLE,
        PdfAnnotationSubtype.SQUARE,
        PdfAnnotationSubtype.POLYGON,
        PdfAnnotationSubtype.POLYLINE,
      ].includes(activeTool.defaults.type!)
    ) {
      return (
        <Stack direction={"column"} width={"10vw"} key={activeTool?.id}>
          <Stack direction={"column"} align={"center"}>
            Stroke color :
            <Color
              type="create"
              colorType="strokeColor"
              defaultValue={activeTool.defaults.strokeColor}
            />
          </Stack>
          {activeTool?.defaults.type != 8 && (
            <Stack direction={"column"} align={"center"}>
              Color type :
              <Transparent
                transparentType="color"
                defaultValue={activeTool.defaults.color}
                color={"#FFFFFF"}
                toolId={activeTool.id}
                type="create"
              />
            </Stack>
          )}
          {activeTool.defaults.color != "transparent" && (
            <Stack direction={"column"} align={"center"}>
              Color :
              <Color
                type="create"
                colorType="color"
                defaultValue={activeTool?.defaults.color}
              />
            </Stack>
          )}
          <Stack direction={"column"} align={"center"}>
            Opacity :
            <PropertySlider
              type="create"
              property="opacity"
              defaultValue={activeTool.defaults.opacity}
            />
          </Stack>
          <Stack direction={"column"} align={"center"}>
            Stroke width :
            <PropertySlider
              type="create"
              property="strokeWidth"
              ratio={5}
              defaultValue={activeTool.defaults.strokeWidth}
            />
          </Stack>
        </Stack>
      );
    } else {
      return (
        <Span width={200} padding={5}>
          Unknown tool
        </Span>
      );
    }
  }
}
