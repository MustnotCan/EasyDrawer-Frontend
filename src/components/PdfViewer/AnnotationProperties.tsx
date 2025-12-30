import {
  Slider,
  Stack,
  HStack,
  parseColor,
  Portal,
  ColorPicker,
  NativeSelect,
} from "@chakra-ui/react";
import { useAnnotationCapability } from "@embedpdf/plugin-annotation/react";
import { PdfBlendMode, PdfStandardFont } from "@embedpdf/models";
export function Color(props: {
  type: "create" | "update";
  colorType: string;
  defaultValue: string;
}) {
  const { provides: annotationApi } = useAnnotationCapability();
  if (!annotationApi) return;
  const activeTool = annotationApi?.getActiveTool();
  return (
    <ColorPicker.Root
      defaultValue={parseColor(props.defaultValue)}
      onValueChangeEnd={(e) => {
        const color = e.value.toString("hex");
        if (props.type == "create") {
          annotationApi?.addColorPreset(color);
          annotationApi?.setToolDefaults(activeTool!.id, {
            color: color,
          });
        } else {
          const selected = annotationApi.getSelectedAnnotation()?.object;
          annotationApi.updateAnnotation(selected!.pageIndex, selected!.id, {
            [props.colorType]: color,
          });
        }
      }}
      size={"sm"}
    >
      <ColorPicker.HiddenInput />
      <ColorPicker.Control>
        <ColorPicker.Trigger />
      </ColorPicker.Control>
      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content>
            <ColorPicker.Area />
            <HStack>
              <ColorPicker.EyeDropper size="xs" variant="outline" />
              <ColorPicker.Sliders />
            </HStack>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
}
export function Transparent(props: {
  type: string;
  defaultValue: string;
  color: string;
}) {
  const { provides: annotationApi } = useAnnotationCapability();
  if (!annotationApi) return;
  const selected = annotationApi.getSelectedAnnotation()?.object;
  return (
    <NativeSelect.Root maxWidth={"10vw"}>
      <NativeSelect.Field
        maxH={"6"}
        defaultValue={props.defaultValue}
        onChange={(e) => {
          const newValue = e.currentTarget.value;
          if (newValue == "transparent") {
            annotationApi.updateAnnotation(selected!.pageIndex, selected!.id, {
              [props.type]: newValue,
            });
          } else {
            annotationApi.updateAnnotation(selected!.pageIndex, selected!.id, {
              [props.type]: props.color,
            });
          }
        }}
      >
        {["transparent", "colored"].map((pres: string) => (
          <option key={pres} value={pres}>
            {pres}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}
export function PropertySlider(props: {
  property: string;
  ratio?: number;
  type: "create" | "update";
  defaultValue: number;
}) {
  const { provides: annotationApi } = useAnnotationCapability();
  if (!annotationApi) return;
  const activeTool = annotationApi.getActiveTool();
  let scaler;
  switch (props.property) {
    case "opacity":
      scaler = 100;
      break;
    case "strokeWidth":
      scaler = 1;
      break;
    default:
      scaler = 1;
  }
  let selectedAnnot;
  if (props.type == "update") {
    selectedAnnot = annotationApi.getSelectedAnnotation();
    if (!selectedAnnot) return;
  }
  const defaultValue = props.defaultValue * scaler;
  return (
    <Slider.Root
      width="10vw"
      defaultValue={[defaultValue * (props.ratio ?? 1)]}
      onValueChangeEnd={(e) => {
        const newValue = e.value[0];
        if (props.type == "create") {
          annotationApi?.setToolDefaults(activeTool!.id, {
            [props.property]: newValue / (props.ratio || 100),
          });
        } else {
          const selected = annotationApi.getSelectedAnnotation()?.object;
          annotationApi.updateAnnotation(selected!.pageIndex, selected!.id, {
            [props.property]: newValue / (props.ratio || 100),
          });
        }
      }}
    >
      <Stack direction={"row"}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Stack>
    </Slider.Root>
  );
}
export function PropertySelecter(props: {
  type: string;
  defaultValue: string;
}) {
  const { provides: annotationApi } = useAnnotationCapability();
  if (!annotationApi) return;
  const selected = annotationApi.getSelectedAnnotation()?.object;
  let selectKeys: string[] = [];
  if (props.type == "blendMode") {
    selectKeys = Object.values(PdfBlendMode).filter(
      (v): v is string => typeof v === "string"
    );
  } else if (props.type == "fontFamily") {
    selectKeys = Object.values(PdfStandardFont).filter(
      (v): v is string => typeof v === "string"
    );
  }
  return (
    <NativeSelect.Root maxWidth={"10vw"}>
      <NativeSelect.Field
        defaultValue={props.defaultValue}
        onChange={(e) => {
          const newValue = e.currentTarget.value;
          annotationApi.updateAnnotation(selected!.pageIndex, selected!.id, {
            [props.type]: Number(newValue),
          });
        }}
      >
        {selectKeys.map((pres: string, index) => (
          <option key={pres} value={index}>
            {pres}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}
