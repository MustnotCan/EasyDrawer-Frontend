import { Button, NativeSelect, Stack } from "@chakra-ui/react";
import { useZoomCapability } from "@embedpdf/plugin-zoom/react";
import { useState } from "react";
export default function ZoomToolbar() {
  const { provides: zoomProvides } = useZoomCapability();
  const [, setIsMarqueeZoomActive] =
    useState<boolean>(false);
  if (!zoomProvides) return;
  const presets = zoomProvides.getPresets();
  return (
    <Stack direction={"row"} justify={"center"} align={"center"}>
      <Button
        variant={"outline"}
        size={"2xs"}
        onClick={() => zoomProvides.requestZoomBy(-0.3)}
      >
        -
      </Button>
      <NativeSelect.Root size="sm">
        <NativeSelect.Field
          maxH={"6"}
          placeholder="Actual size"
          value={
            presets.find(
              (pres) => pres.value == zoomProvides.getState().zoomLevel
            )?.name || zoomProvides.getState().currentZoomLevel.toString()
          }
          onChange={(e) => {
            zoomProvides.requestZoom(
              presets.find((pres) => pres.name == e.currentTarget.value)!.value
            );
          }}
        >
          {presets.map((pres) => (
            <option key={pres.value} value={pres.name}>
              {pres.name}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>

      <Button
        variant={"outline"}
        size={"2xs"}
        onClick={() => zoomProvides.requestZoomBy(0.3)}
      >
        +
      </Button>
      <Button
        variant={"outline"}
        size={"2xs"}
        onClick={() => {
          zoomProvides.toggleMarqueeZoom();
          setIsMarqueeZoomActive((prev) => !prev);
        }}
        background={zoomProvides.isMarqueeZoomActive() ? "gray.400" : ""}
      >
        Area Zoom
      </Button>
    </Stack>
  );
}
