import { Span, Stack } from "@chakra-ui/react";
import { useAnnotationCapability } from "@embedpdf/plugin-annotation/react";
import { useEffect, useState } from "react";
import {
  PdfBlendMode,
  PdfCircleAnnoObject,
  PdfPolygonAnnoObject,
  PdfPolylineAnnoObject,
  PdfSquareAnnoObject,
  type PdfAnnotationObject,
} from "@embedpdf/models";
import {
  Color,
  PropertySelecter,
  PropertySlider,
  Transparent,
} from "../AnnotationProperties";

export default function AnnotationEditer() {
  const { provides: annotationApi } = useAnnotationCapability();
  const [selectedAnnot, setSelectedAnnot] = useState<PdfAnnotationObject>();
  useEffect(() => {
    if (!annotationApi) return;

    return annotationApi.onStateChange(() => {
      setSelectedAnnot(annotationApi.getSelectedAnnotation()?.object);
    });
  }, [annotationApi]);
  if (!selectedAnnot)
    return (
      <Span padding={5} width={200}>
        Please select some annotation first
      </Span>
    );

  if (selectedAnnot?.type == 9) {
    //highlight
    return (
      <Stack direction={"column"} width={"10vw"} key={selectedAnnot.id}>
        <Stack direction={"column"} align={"center"}>
          Color :
          <Color
            type="update"
            colorType="color"
            defaultValue={selectedAnnot.color}
          />
        </Stack>
        <Stack direction={"column"} align={"center"}>
          Opacity :
          <PropertySlider
            type="update"
            property="opacity"
            defaultValue={selectedAnnot.opacity!}
          />
        </Stack>
        <Stack direction={"column"} align={"center"}>
          Blend mode :{" "}
          <PropertySelecter
            type="blendMode"
            defaultValue={PdfBlendMode[selectedAnnot.blendMode!]}
          />
        </Stack>
      </Stack>
    );
  } else if (selectedAnnot?.type == 15) {
    //ink
    return (
      <Stack direction={"column"} width={"10vw"} key={selectedAnnot.id}>
        <Stack direction={"column"} align={"center"}>
          Color :
          <Color
            type="update"
            colorType="color"
            defaultValue={selectedAnnot.color}
          />
        </Stack>
        <Stack direction={"column"} align={"center"}>
          Opacity :
          <PropertySlider
            type="update"
            property="opacity"
            defaultValue={selectedAnnot.opacity!}
          />
        </Stack>
        <Stack direction={"column"} align={"center"}>
          Stroke width :
          <PropertySlider
            type="update"
            property="strokeWidth"
            ratio={6}
            defaultValue={selectedAnnot.strokeWidth!}
          />
        </Stack>
      </Stack>
    );
  } else if (selectedAnnot?.type == 3) {
    //freeText
    return (
      <Stack direction={"column"} width={"10vw"} key={selectedAnnot.id}>
        <Stack direction={"column"} align={"center"}>
          Font color :
          <Color
            type="update"
            colorType="fontColor"
            defaultValue={selectedAnnot.fontColor}
          />
        </Stack>
        <Stack direction={"column"} align={"center"}>
          Opacity :
          <PropertySlider
            type="update"
            property="opacity"
            defaultValue={selectedAnnot.opacity!}
          />
        </Stack>
        <Stack direction={"column"} align={"center"}>
          Font size :
          <PropertySlider
            type="update"
            property="fontSize"
            ratio={3}
            defaultValue={selectedAnnot.fontSize!}
          />
        </Stack>
        <Stack direction={"column"} align={"center"} >
          Font family :{" "}
          <PropertySelecter
            type="fontFamily"
            defaultValue={selectedAnnot.fontFamily.toString()}
          />
        </Stack>
        <Stack direction={"column"} align={"center"}>
          Color type :
          <Transparent
            type="backgroundColor"
            defaultValue={selectedAnnot.backgroundColor ?? "transparent"}
            color={selectedAnnot.fontColor}
          />
        </Stack>
        {selectedAnnot.backgroundColor != "transparent" && (
          <Stack direction={"column"} align={"center"}>
            Background color :
            <Color
              type="update"
              colorType="backgroundColor"
              defaultValue={selectedAnnot.backgroundColor ?? "transparent"}
            />
          </Stack>
        )}
      </Stack>
    );
  } else if (selectedAnnot?.type == 10) {
    //underline
    return (
      <Stack direction={"column"} width={"10vw"} key={selectedAnnot.id}>
        <Stack direction={"column"} align={"center"}>
          color :
          <Color
            type="update"
            colorType="color"
            defaultValue={selectedAnnot.color}
          />
        </Stack>
        <Stack direction={"column"} align={"center"}>
          Opacity :
          <PropertySlider
            type="update"
            property="opacity"
            defaultValue={selectedAnnot.opacity!}
          />
        </Stack>{" "}
      </Stack>
    );
  } else if (selectedAnnot?.type == 11) {
    //squiggly
    return (
      <Stack direction={"column"} width={"10vw"} key={selectedAnnot.id}>
        <Stack direction={"column"} align={"center"}>
          Color :
          <Color
            type="update"
            colorType="color"
            defaultValue={selectedAnnot.color}
          />
        </Stack>
        <Stack direction={"column"} align={"center"}>
          Opacity :
          <PropertySlider
            type="update"
            property="opacity"
            defaultValue={selectedAnnot.opacity!}
          />
        </Stack>{" "}
      </Stack>
    );
  } else if (selectedAnnot?.type == 4) {
    //line
    return (
      <Stack direction={"column"} width={"10vw"} key={selectedAnnot.id}>
        <Stack direction={"column"} align={"center"}>
          Color :
          <Color
            type="update"
            colorType="strokeColor"
            defaultValue={selectedAnnot.strokeColor}
          />
        </Stack>
        <Stack direction={"column"} align={"center"}>
          Opacity :
          <PropertySlider
            type="update"
            property="opacity"
            defaultValue={selectedAnnot.opacity!}
          />
        </Stack>
        <Stack direction={"column"} align={"center"}>
          Stroke width :
          <PropertySlider
            type="update"
            property="strokeWidth"
            ratio={5}
            defaultValue={selectedAnnot.strokeWidth!}
          />
        </Stack>
      </Stack>
    );
  } else if ([5, 6, 7, 8].includes(selectedAnnot.type)) {
    const annot:
      | PdfCircleAnnoObject
      | PdfPolygonAnnoObject
      | PdfSquareAnnoObject
      | PdfPolylineAnnoObject = selectedAnnot as
      | PdfCircleAnnoObject
      | PdfPolygonAnnoObject
      | PdfSquareAnnoObject
      | PdfPolylineAnnoObject;
    return (
      <Stack direction={"column"} width={"10vw"} key={selectedAnnot.id}>
        <Stack direction={"column"} align={"center"}>
          Stroke color :
          <Color
            type="update"
            colorType="strokeColor"
            defaultValue={annot.strokeColor}
          />
        </Stack>
        {selectedAnnot.type != 8 && (
          <Stack direction={"column"} align={"center"}>
            Color type :{" "}
            <Transparent
              type="color"
              defaultValue={annot.color}
              color={annot.strokeColor}
            />
          </Stack>
        )}
        {annot.color != "transparent" && (
          <Stack direction={"column"} align={"center"}>
            Color :
            <Color type="update" colorType="color" defaultValue={annot.color} />
          </Stack>
        )}
        <Stack direction={"column"} align={"center"}>
          Opacity :
          <PropertySlider
            type="update"
            property="opacity"
            defaultValue={annot.opacity!}
          />
        </Stack>
        <Stack direction={"column"} align={"center"}>
          Stroke width :
          <PropertySlider
            type="update"
            property="strokeWidth"
            ratio={5}
            defaultValue={annot.strokeWidth!}
          />
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Span width={200} padding={5}>
        Unknown annotation
      </Span>
    );
  }
}
