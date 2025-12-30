import { Button, Stack } from "@chakra-ui/react";
import { useActiveDocument } from "@embedpdf/plugin-document-manager/react";
import { useRotate } from "@embedpdf/plugin-rotate/react";
import { FaRotateLeft, FaRotateRight } from "react-icons/fa6";
export default function RotateToolbar() {
  
  const { activeDocumentId } = useActiveDocument();
  const { provides: rotate } = useRotate(activeDocumentId!);

  if (!rotate) {
    return null;
  }

  return (
    <Stack direction={"row"}>
      <Button variant={"outline"} size={"2xs"} onClick={rotate.rotateBackward}>
        <FaRotateLeft />
      </Button>
      <Button variant={"outline"} size={"2xs"} onClick={rotate.rotateForward}>
        <FaRotateRight />
      </Button>
    </Stack>
  );
}
