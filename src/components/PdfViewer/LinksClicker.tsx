import {
  AnnotationCapability,
  useAnnotationCapability,
} from "@embedpdf/plugin-annotation/react";
import { useScroll } from "@embedpdf/plugin-scroll/react";
import { useEffect, useState } from "react";
import { PdfAnnotationObject, type PdfLinkAnnoObject } from "@embedpdf/models";
import { Span } from "@chakra-ui/react";
import { useZoom } from "@embedpdf/plugin-zoom/react";
import { useActiveDocument } from "@embedpdf/plugin-document-manager/react";

export default function LinksClicker(props: { pageIndex: number }) {
  const { activeDocumentId } = useActiveDocument();
  const { provides: scrollApi } = useScroll(activeDocumentId!);
  const { provides: annotationApi } = useAnnotationCapability();
  const { provides: zoomApi } = useZoom(activeDocumentId!);
  const [hovered, setHovered] = useState("");
  const [links, setLinks] = useState<PdfLinkAnnoObject[]>([]);
  useEffect(() => {
    if (!annotationApi) return;
    annotationApi
      .getPageAnnotations({ pageIndex: props.pageIndex })
      .toPromise()
      .then((annotations) => {
        const linksAnnots = annotations.filter((annot) => annot.type == 2);
        setLinks(linksAnnots);
      });
  }, [annotationApi, props.pageIndex]);
  const zoomlevel = zoomApi?.getState().currentZoomLevel || 1;
  if (!activeDocumentId) return null;
  const Xkey = activeDocumentId + "linkXOffset";
  const Ykey = activeDocumentId + "linkYOffset";
  const linkXOffset = Number(localStorage.getItem(Xkey) ?? 0);
  const linkYOffset = Number(localStorage.getItem(Ykey) ?? 0);
  return (
    <>
      {links.map((link) => {
        const top = link.rect.origin.y + linkYOffset;
        const left = link.rect.origin.x + linkXOffset;
        return (
          <Span
            key={link.id}
            top={(top >= 0 ? top : 0) * zoomlevel + "px"}
            left={(left >= 0 ? left : 0) * zoomlevel + "px"}
            width={link.rect.size.width * zoomlevel + "px"}
            height={link.rect.size.height * zoomlevel + "px"}
            position={"absolute"}
            zIndex={1}
            backgroundColor={
              hovered == link.id ? "rgba(255, 255, 102, 0.3)" : ""
            }
            onMouseEnter={() => {
              setHovered(link.id);
            }}
            onMouseLeave={() => setHovered("")}
            onClick={() => {
              if (link.target) {
                const type = link.target?.type;
                if (type == "action") {
                  if (link.target.action.type == 3) {
                    window.open(link.target.action.uri, "__blank");
                  } else if (link.target.action.type == 1) {
                    const { pageIndex } = link.target.action.destination;
                    getLinkPosition(annotationApi, pageIndex, link, links).then(
                      (res) => {
                        if (res)
                          scrollApi?.scrollToPage!({
                            pageNumber: pageIndex + 1,
                            behavior: "instant",
                            pageCoordinates: {
                              x: res.x,
                              y: res.y,
                            },
                          });
                      }
                    );
                  }
                } else {
                  const { pageIndex } = link.target.destination;
                  getLinkPosition(annotationApi, pageIndex, link, links).then(
                    (res) => {
                      if (res)
                        scrollApi?.scrollToPage!({
                          pageNumber: pageIndex + 1,
                          behavior: "instant",
                          pageCoordinates: {
                            x: res.x,
                            y: res.y,
                          },
                        });
                    }
                  );
                }
              }
            }}
            cursor={"pointer"}
          ></Span>
        );
      })}
    </>
  );
}

async function getLinkPosition(
  annotationApi: Readonly<AnnotationCapability> | null,
  pageIndex: number,
  link: PdfLinkAnnoObject,
  links: PdfLinkAnnoObject[]
) {
  return annotationApi
    ?.getPageAnnotations({ pageIndex: pageIndex })
    .toPromise()
    .then((annots: PdfAnnotationObject[]) => {
      const pageLinks = annots.filter((annot) => {
        if (annot.type == 2) {
          if (annot.target?.type == "action") {
            return (
              annot.target.action.type == 1 &&
              annot.target.action.destination.pageIndex == link.pageIndex
            );
          } else {
            return annot.target?.destination.pageIndex == link.pageIndex;
          }
        } else return false;
      });

      const sortedLinks = links
        .filter((annot) => {
          if (annot.type == 2) {
            if (annot.target?.type == "action") {
              if (link.target?.type == "destination") {
                return (
                  annot.target.action.type == 1 &&
                  annot.target.action.destination.pageIndex ==
                    link.target?.destination.pageIndex
                );
              } else {
                return (
                  annot.target.action.type == 1 &&
                  annot.target.action.destination.pageIndex ==
                    (link.target?.action.type == 1 &&
                      link.target?.action.destination.pageIndex)
                );
              }
            } else {
              if (link.target?.type == "destination") {
                return (
                  annot.target?.destination.pageIndex ==
                  link.target?.destination.pageIndex
                );
              } else {
                return (
                  annot.target?.destination.pageIndex ==
                  (link.target?.action.type == 1 &&
                    link.target?.action.destination.pageIndex)
                );
              }
            }
          } else return false;
        })
        .sort((b: PdfLinkAnnoObject, a: PdfLinkAnnoObject) => {
          let xa: number, xb: number, ya: number, yb: number;
          if (a.target?.type == "destination") {
            xa = a.target.destination.view[0];
            ya = a.target.destination.view[1];
          } else {
            xa =
              a.target?.action.type == 1
                ? a.target?.action.destination.view[0]
                : 0;
            ya =
              a.target?.action.type == 1
                ? a.target?.action.destination.view[1]
                : 0;
          }
          if (b.target?.type == "destination") {
            xb = b.target.destination.view[0];
            yb = b.target.destination.view[1];
          } else {
            xb =
              b.target?.action.type == 1
                ? b.target?.action.destination.view[0]
                : 0;
            yb =
              b.target?.action.type == 1
                ? b.target?.action.destination.view[1]
                : 0;
          }
          if (ya > yb) return 1;
          if (ya < yb) return -1;
          if (xa > xb) return 1;
          if (xa < xb) return -1;
          return 0;
        });
      const targetPlace = sortedLinks.findIndex(
        (lk: { pageIndex: number; id: string }) =>
          lk.pageIndex == link.pageIndex && lk.id == link.id
      );
      const foundLink = pageLinks[targetPlace];

      if (foundLink) {
        const x: number = foundLink.rect.origin.x;
        const y: number = foundLink.rect.origin.y;
        return { x, y };
      } else {
        return { x: 0, y: 0 };
      }
    });
}
