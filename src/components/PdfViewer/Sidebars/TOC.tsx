import { Accordion, Span, Stack } from "@chakra-ui/react";
import type { PdfBookmarkObject } from "@embedpdf/models";
import { useScrollCapability } from "@embedpdf/plugin-scroll/react";
export default function TableOfContents(props: {
  bookmarks: PdfBookmarkObject[];
}) {
  if (props.bookmarks.length > 0) {
    return (
      <Stack
        borderRightWidth={"medium"}
        borderRightColor={"black"}
        borderRightStyle={"solid"}
      >
        <TOCRecursiveAccordion items={props.bookmarks} isRoot={true} />
      </Stack>
    );
  } else {
    return <Span padding={5} width={200}>No bookmarks found</Span>;
  }
}
export function TOCRecursiveAccordion(props: {
  items: PdfBookmarkObject[];
  isRoot?: boolean;
}) {
  const { provides: scrollApi } = useScrollCapability();
  return (
    <Accordion.Root
      multiple
      paddingLeft={"0.5vw"}
      {...(props.isRoot
        ? {
            maxHeight: "90vh",
            overflowY: "auto",
            marginLeft: "0vw",
            marginRight: "0vw",
            maxWidth: "15rem",
          }
        : {})}
    >
      {props.items.map((item, index) => (
        <Accordion.Item key={index} value={item.title || ""}>
          <Stack padding={2} fontSize={"sm"} direction={"row"} align={"center"}>
            <Span
              cursor={"pointer"}
              onClick={() => {
                if (!scrollApi) return;
                if (item.target?.type == "destination") {
                  scrollApi.scrollToPage({
                    pageNumber: item.target.destination.pageIndex + 1,
                    behavior: "instant",
                  });
                } else {
                  scrollApi.scrollToPage({
                    pageNumber:
                      (item.target?.action.type == 1 &&
                        item.target.action.destination &&
                        item.target.action.destination.pageIndex + 1) ||
                      1,
                    behavior: "instant",
                  });
                }
              }}
            >
              {item.title}
            </Span>
            {item.children && item.children?.length > 0 && (
              <Accordion.ItemTrigger
                justifyContent={"end"}
                alignContent={"end"}
                justifySelf={"end"}
                alignSelf={"end"}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                width={"fit-content"}
              >
                <Accordion.ItemIndicator
                  justifyContent={"end"}
                  alignContent={"end"}
                  justifySelf={"end"}
                  alignSelf={"end"}
                />
              </Accordion.ItemTrigger>
            )}
          </Stack>
          {item.children && item.children?.length > 0 && (
            <Accordion.ItemContent>
              <TOCRecursiveAccordion items={item.children} isRoot={false} />
            </Accordion.ItemContent>
          )}
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
