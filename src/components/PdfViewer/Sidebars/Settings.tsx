import { HStack, Slider, Span, Stack } from "@chakra-ui/react";
import { useActiveDocument } from "@embedpdf/plugin-document-manager/react";

export default function Settings() {
  const { activeDocumentId } = useActiveDocument();
  if (!activeDocumentId) return <p>No active document</p>;
  const Xkey = activeDocumentId + "linkXOffset";
  const Ykey = activeDocumentId + "linkYOffset";
  const linkXOffset = Number(localStorage.getItem(Xkey) ?? 0);
  const linkYOffset = Number(localStorage.getItem(Ykey) ?? 0);
  return (
    <Stack direction={"column"}>
      <Span>Link annotation Offset : </Span>
      <Stack direction={"row"}>
        <Slider.Root
          min={-400}
          max={+400}
          width="200px"
          defaultValue={[linkXOffset]}
          onValueChangeEnd={(e) => {
            localStorage.setItem(Xkey, e.value[0].toString());
          }}
        >
          <HStack justify="space-between">
            <Slider.Label>X : </Slider.Label>
            <Slider.ValueText />
          </HStack>
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs />
          </Slider.Control>
        </Slider.Root>
      </Stack>
      <Stack direction={"row"}>
        <Slider.Root
          min={-400}
          max={+400}
          width="200px"
          defaultValue={[linkYOffset]}
          onValueChangeEnd={(e) => {
            localStorage.setItem(Ykey, e.value[0].toString());
            console.log(e.value);
          }}
        >
          <HStack justify="space-between">
            <Slider.Label>Y : </Slider.Label>
            <Slider.ValueText />
          </HStack>
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs />
          </Slider.Control>
        </Slider.Root>
      </Stack>
    </Stack>
  );
}
