import { useAnnotationCapability } from "@embedpdf/plugin-annotation/react";
import { Scroller, useScrollCapability } from "@embedpdf/plugin-scroll/react";
import { Viewport } from "@embedpdf/plugin-viewport/react";
import {
  DocumentContent,
  useDocumentManagerCapability,
} from "@embedpdf/plugin-document-manager/react";
import { useEffect, useRef, useState } from "react";
import { useEngine } from "@embedpdf/engines/react";
import { PdfAnnotationObject } from "@embedpdf/models";
import PageRender from "./PageRender";
import {
  getBookAnnotations,
  updateBookLastAccess,
} from "../../utils/queries/booksApi";
import { getPdf } from "../db";
import { GlobalPointerProvider } from "@embedpdf/plugin-interaction-manager/react";
export default function ViewPort(props: {
  pdfUrl: string;
  pdfId: string;
  pdfPage?: number;
}) {
  const { provides: annotationApi } = useAnnotationCapability();
  const { provides: loaderApi } = useDocumentManagerCapability();
  const [annots, setAnnots] = useState<PdfAnnotationObject[]>([]);
  const engine = useEngine();
  const annotRef = useRef(false);
  const [fetchingPdf, setFetchingPdf] = useState<boolean>(true);
  useEffect(() => {
    if (!loaderApi) return;
    getPdf(props.pdfId).then((pdfData) => {
      let loadingPromise = null;
      if (pdfData) {
        loadingPromise = loaderApi.openDocumentBuffer({
          documentId: props.pdfId,
          buffer: pdfData.data,
          name: props.pdfId,
        });
        updateBookLastAccess({ bookId: props.pdfId });
      } else {
        loadingPromise = loaderApi.openDocumentUrl({
          url: props.pdfUrl,
          documentId: props.pdfId,
        });
      }
      loadingPromise.toPromise().then((doc) => {
        loaderApi.setActiveDocument(doc.documentId);
        getBookAnnotations({ bookId: doc.documentId }).then((annots) => {
          setAnnots(
            annots.map(
              (annot: {
                annotationDetails: PdfAnnotationObject[];
                id: string;
              }) => annot.annotationDetails
            )
          );
        });
      });
      setFetchingPdf(false);
    });
  }, [engine, loaderApi, props.pdfId, props.pdfPage, props.pdfUrl]);
  if (fetchingPdf) {
    return <p> Pdf Is being fetched, Please Wait </p>;
  } else {
    return (
      <GlobalPointerProvider documentId={props.pdfId}>
        <DocumentContent documentId={props.pdfId}>
          {({ isLoaded, isLoading, isError }) => (
            <>
              {isError && <p>Error opening pdf file</p>}
              {isLoading && <p> PDF not found locally, fetching from remote</p>}
              {isLoaded && (
                <>
                  <ScrollToPageOnLoad
                    documentId={props.pdfId}
                    initialPage={
                      props.pdfPage
                        ? props.pdfPage > 1
                          ? props.pdfPage
                          : 1
                        : localStorage.getItem("LP_" + props.pdfId)
                          ? Number(localStorage.getItem("LP_" + props.pdfId))
                          : 1
                    }
                  />
                  <Viewport
                    documentId={props.pdfId}
                    style={{
                      overflowY: "auto",
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#ededed",
                    }}
                    onClick={() => {
                      if (annotationApi && annotRef.current) {
                        if (annotationApi.getSelectedAnnotation()) {
                          annotationApi.deselectAnnotation();
                          annotRef.current = false;
                        }
                      }
                    }}
                    draggable={false}
                    onDragStart={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Scroller
                      documentId={props.pdfId}
                      renderPage={({ width, height, pageIndex }) => (
                        <PageRender
                          documentId={props.pdfId}
                          width={width}
                          height={height}
                          pageIndex={pageIndex}
                          annotRef={annotRef}
                          pageAnnots={{ annots: annots, setAnnots: setAnnots }}
                        />
                      )}
                    />
                  </Viewport>
                </>
              )}
            </>
          )}
        </DocumentContent>
      </GlobalPointerProvider>
    );
  }
}
const ScrollToPageOnLoad = ({
  documentId,
  initialPage,
}: {
  documentId: string;
  initialPage: number;
}) => {
  const { provides: scrollCapability } = useScrollCapability();

  useEffect(() => {
    if (!scrollCapability) return;
    const unsubscribe = scrollCapability.onLayoutReady((event) => {
      if (event.documentId === documentId) {
        scrollCapability.forDocument(documentId).scrollToPage({
          pageNumber: initialPage,
          behavior: "instant",
        });
      }
    });

    return unsubscribe;
  }, [scrollCapability, documentId, initialPage]);

  return null;
};
