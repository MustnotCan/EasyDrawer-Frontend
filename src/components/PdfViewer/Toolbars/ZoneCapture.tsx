import { Button } from "@chakra-ui/react";
import { useAnnotation } from "@embedpdf/plugin-annotation/react";
import {
  CaptureAreaEvent,
  useCaptureCapability,
} from "@embedpdf/plugin-capture/react";
import { useActiveDocument } from "@embedpdf/plugin-document-manager/react";
import { useEffect, useState } from "react";
import { TbCapture } from "react-icons/tb";
export default function ZoneCapture() {
  const { provides: captureApi } = useCaptureCapability();
  const { activeDocumentId } = useActiveDocument();

  const { provides: annotationApi } = useAnnotation(activeDocumentId!);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!captureApi || !annotationApi) return;
    const unsub1 = captureApi.onStateChange((state) =>
      setIsActive(state.state.isMarqueeCaptureActive)
    );
    const unsub = captureApi.onCaptureArea((result: CaptureAreaEvent) => {
      if (annotationApi.getState().hasPendingChanges) {
        annotationApi
          .commit()
          .toPromise()
          .then((done) => {
            if (done) {
              captureApi.captureArea(result.pageIndex, result.rect);
            }
          });
      } else {
        const newUrl = URL.createObjectURL(result.blob);
        const a = document.createElement("a");
        a.href = newUrl;
        a.download = "Capture.png";
        a.click();
        setImageUrl(newUrl);
      }
    });
    return () => {
      unsub();
      unsub1();
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [annotationApi, captureApi, imageUrl]);

  return (
    <Button
      onClick={() => {
        captureApi?.toggleMarqueeCapture();
      }}
      background={isActive ? "gray.400" : ""}
      variant={"outline"}
      size={"2xs"}
    >
      <TbCapture />
    </Button>
  );
}
