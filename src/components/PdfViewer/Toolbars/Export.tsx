import { Button, Stack } from "@chakra-ui/react";
import { useAnnotationCapability } from "@embedpdf/plugin-annotation/react";
import { useExportCapability } from "@embedpdf/plugin-export/react";
import { FaDownload } from "react-icons/fa";
export default function ExportToolbar() {
  const { provides: exportApi } = useExportCapability();
  const { provides: annotationApi } = useAnnotationCapability();
  return (
    <Stack direction={"row"}>
      <Button
        variant={"outline"}
        size={"2xs"}
        onClick={() => {
          annotationApi
            ?.commit()
            .toPromise()
            .then(() => exportApi?.download());
        }}
        disabled={!exportApi}
      >
        <FaDownload />
      </Button>
    </Stack>
  );
}
