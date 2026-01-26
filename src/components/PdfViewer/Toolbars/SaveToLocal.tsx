import { getPdf, removePdf, savePdf } from "@/components/db";
import { Tooltip } from "@/ui/tooltip";
import { Button, Spinner } from "@chakra-ui/react";
import { useActiveDocument } from "@embedpdf/plugin-document-manager/react";
import { useExportCapability } from "@embedpdf/plugin-export/react";
import { useEffect, useState } from "react";
import { MdDelete, MdSaveAlt } from "react-icons/md";
type loadingState = "false" | "true" | "loading";
export default function SaveToLocal() {
  const { activeDocumentId } = useActiveDocument();
  const { provides: exportApi } = useExportCapability();
  const [isCached, setIsCached] = useState<loadingState>("false");
  useEffect(() => {
    if (!activeDocumentId) return;
    getPdf(activeDocumentId).then((pdfData) => {
      if (pdfData) {
        setIsCached("true");
      }
    });
  }, [activeDocumentId]);
  if ("false" == isCached) {
    return (
      <Button
        variant={"outline"}
        size="2xs"
        onClick={async () => {
          if (!activeDocumentId) return;
          setIsCached("loading");
          exportApi
            ?.saveAsCopy()
            .toPromise()
            .then((buffer) => {
              if (buffer) {
                savePdf(activeDocumentId, { data: buffer }).then(() => {
                  setIsCached("true");
                  console.log("Pdf Cached");
                });
              } else {
                setIsCached("false");
              }
            });
        }}
      >
        <Tooltip content="save locally">
          <MdSaveAlt />
        </Tooltip>
      </Button>
    );
  } else if ("true" == isCached) {
    return (
      <Button
        variant={"outline"}
        size="2xs"
        onClick={async () => {
          if (!activeDocumentId) return;
          setIsCached("loading");
          removePdf(activeDocumentId).then(() => {
            setIsCached("false");
            console.log("Pdf deleted from cache !");
          });
        }}
      >
        <Tooltip content="remove from cache">
          <MdDelete />
        </Tooltip>
      </Button>
    );
  } else if ("loading" == isCached) {
    return <Spinner size={"md"}/>;
  }
}
