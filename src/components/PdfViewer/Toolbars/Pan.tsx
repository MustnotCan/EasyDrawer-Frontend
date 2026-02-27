import { Button } from "@chakra-ui/react";
import { useActiveDocument } from "@embedpdf/plugin-document-manager/react";
import { usePan } from "@embedpdf/plugin-pan/react";
import { MdPanTool } from "react-icons/md";
export default function PanToolbar() {
  const { activeDocumentId } = useActiveDocument();

  const { provides: pan, isPanning } = usePan(activeDocumentId!);

  if (!pan) return null;

  return (
    <Button
      size={"2xs"}
      onClick={pan.togglePan}
      variant={"outline"}
      background={isPanning ? "gray.400" : "transparent"}
      display={{ base: "none", lg: "block" }}
    >
      <MdPanTool />
    </Button>
  );
}
