import { Accordion, Span, Stack } from "@chakra-ui/react";
import type { PdfBookmarkObject } from "@embedpdf/models";
import { ScrollCapability } from "@embedpdf/plugin-scroll";
export default function TableOfContents(props: {
  bookmarks: PdfBookmarkObject[];
  scrollApi: Readonly<ScrollCapability> | null;
}) {
  if (props.bookmarks.length > 0) {
    return (
      <Stack
        borderRightWidth={"medium"}
        borderRightColor={"black"}
        borderRightStyle={"solid"}
      >
        <TOCRecursiveAccordion
          items={props.bookmarks}
          isRoot={true}
          scrollApi={props.scrollApi}
        />
      </Stack>
    );
  } else {
    return (
      <Span padding={5} width={200}>
        No bookmarks found
      </Span>
    );
  }
}
export function TOCRecursiveAccordion(props: {
  items: PdfBookmarkObject[];
  isRoot?: boolean;
  scrollApi: Readonly<ScrollCapability> | null;
}) {
  return (
    <Accordion.Root
      multiple
      paddingLeft={"0.5dvw"}
      {...(props.isRoot
        ? {
            height: { base: "100dvh", lg: "95dvh" },
            overflowY: "auto",
            marginLeft: "0vw",
            marginRight: "0vw",
            width: "15dvw",
            scrollbar: "hidden",
          }
        : {})}
      fontSize={{ base: "0.60rem", md: "0.75rem", lg: "0.99em" }}
    >
      {props.items.map((item, index) => (
        <Accordion.Item key={index} value={item.title || ""}>
          <Stack padding={"0.45rem"} direction={"row"} align={"center"}>
            <Span
              cursor={"pointer"}
              onClick={() => {
                if (!props.scrollApi) return;
                if (item.target?.type == "destination") {
                  props.scrollApi.scrollToPage({
                    pageNumber: item.target.destination.pageIndex + 1,
                    behavior: "instant",
                  });
                } else {
                  props.scrollApi.scrollToPage({
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
              <TOCRecursiveAccordion
                items={item.children}
                isRoot={false}
                scrollApi={props.scrollApi}
              />
            </Accordion.ItemContent>
          )}
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
