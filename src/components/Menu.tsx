import TagList from "./ItemViewTagList.tsx";
import { itemViewMenuPropsType } from "../types/types";
import {
  Box,
  Button,
  Dialog,
  Grid,
  Menu,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";
import { CiMenuBurger } from "react-icons/ci";
import { downloadingBook } from "../utils/queries/booksApi.ts";
import { FaDownload } from "react-icons/fa6";
import { useTags } from "../utils/Hooks/TagsHook.ts";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ItemViewMenu(props: itemViewMenuPropsType) {
  type MobileDialogView = "actions" | "pages" | "pageDetail" | "tags";
  type FoundPageResult = NonNullable<itemViewMenuPropsType["pages"]>[number];
  const tags = useTags();
  const navigate = useNavigate();
  const [isFoundPagesOpen, setIsFoundPagesOpen] = useState(false);
  const [selectedFoundPage, setSelectedFoundPage] =
    useState<FoundPageResult | null>(null);
  const [mobileDialogStack, setMobileDialogStack] = useState<
    MobileDialogView[]
  >([]);

  const openFoundPage = (pageNumber: number) => {
    const encodedUri = encodeURIComponent(props.id);
    const newWindow = window.open(
      "http://" + location.host + `/pdfreader/${encodedUri}/${pageNumber || 1}`,
      "_blank",
    );
    if (newWindow) {
      newWindow.localStorage.setItem(props.id, props.name);
    }
  };

  const openContainingFolder = () => {
    if (props.path && props.path != "/") {
      navigate("/multiTagger", {
        state: [props.path, props.path + "/" + props.name],
      });
    } else {
      navigate("/multiTagger");
    }
  };

  const openMobileDialog = (view: MobileDialogView) => {
    setMobileDialogStack((prev) => [...prev, view]);
  };

  const closeAllMobileDialogs = () => {
    setMobileDialogStack([]);
    setSelectedFoundPage(null);
  };

  const closeOneMobileDialog = () => {
    setMobileDialogStack((prev) => prev.slice(0, -1));
  };

  const currentMobileDialog = mobileDialogStack[mobileDialogStack.length - 1];

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ id?: string }>;
      if (customEvent.detail?.id === props.id) {
        setSelectedFoundPage(null);
        setMobileDialogStack(["actions"]);
      }
    };
    window.addEventListener("item-view-mobile-actions-open", handler);
    return () => {
      window.removeEventListener("item-view-mobile-actions-open", handler);
    };
  }, [props.id]);
  /*const removeBookByIdMutation = useMutation({
    mutationFn: (id: string) => removeBookById(id),
    onSuccess: () => {
      queryClient.setQueryData(["books", ...props.queryData], (prevData) => {
        console.log(prevData);
        console.log(props.queryData);
      });
      revalidate();
    },
    onError: (err) => {
      console.error("Error removing book by id:", err);
    },
  });*/

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Box
          as="button"
          display={{ base: "none", lg: "inline-flex" }}
          alignItems="center"
          justifyContent="center"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <CiMenuBurger size="25" />
        </Box>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Menu.Item
              value="download"
              onClick={() => downloadingBook(props.downloadPath, props.name)}
            >
              <FaDownload /> Download
            </Menu.Item>
            <Menu.Item
              value="open containing folder"
              onClick={openContainingFolder}
            >
              Open containing folder
            </Menu.Item>
            {props.pages && props.pages.length > 0 && (
              <Menu.Item
                value="found pages"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFoundPagesOpen(true);
                }}
              >
                Found pages ({props.pages.length})
              </Menu.Item>
            )}

            <Menu.Root positioning={{ placement: "right-start", gutter: 2 }}>
              <Menu.TriggerItem onDoubleClick={(e) => e.stopPropagation()}>
                Change Tags <LuChevronRight />
              </Menu.TriggerItem>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <TagList
                      itemTags={props.itemTags}
                      tags={tags}
                      path={props.path + "/" + props.name}
                      queryData={props.queryData}
                    />
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>

      <Dialog.Root
        open={isFoundPagesOpen}
        onOpenChange={(e) => setIsFoundPagesOpen(e.open)}
        size={{ base: "sm", md: "xl" }}
        scrollBehavior="inside"
        placement={{ base: "top", md: "center" }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner
            padding={{ base: 4, md: 4 }}
            onDoubleClick={(e) => e.stopPropagation()}
          >
            <Dialog.Content
              borderRadius={{ base: "xl", md: "xl" }}
              maxH={{ base: "80svh", md: "75vh" }}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Dialog.Header>
                <Dialog.Title>
                  Found pages ({props.pages?.length || 0})
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Grid
                  templateColumns={{
                    base: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 1fr))",
                  }}
                  gap={3}
                  pb={2}
                >
                  {props.pages?.map((page) => (
                    <Box
                      key={page.page}
                      as="button"
                      textAlign="left"
                      padding={3}
                      borderWidth="1px"
                      borderRadius="lg"
                      bg="bg.panel"
                      _hover={{ bg: "bg.muted" }}
                      _active={{ transform: "scale(0.99)" }}
                      onClick={() => {
                        setSelectedFoundPage(page);
                      }}
                      overflow={"auto"}
                    >
                      <Text fontWeight="semibold" mb={2}>
                        Page {page.page}
                      </Text>
                      <Box
                        fontSize="sm"
                        color="fg.muted"
                        lineHeight="1.35"
                        height={"30vh"}
                        dangerouslySetInnerHTML={{
                          __html: page.highlighted.split(/\\./).join(". "),
                        }}
                      />
                    </Box>
                  ))}
                </Grid>
              </Dialog.Body>
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root
        open={!!selectedFoundPage && mobileDialogStack.length === 0}
        onOpenChange={(e) => {
          if (!e.open) setSelectedFoundPage(null);
        }}
        size={{ base: "sm", md: "lg" }}
        scrollBehavior="inside"
        placement={{ base: "top", md: "center" }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner padding={{ base: 4, md: 4 }}>
            <Dialog.Content
              borderRadius="xl"
              maxH={{ base: "80svh", md: "75vh" }}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Dialog.Header>
                <Dialog.Title>
                  {selectedFoundPage
                    ? `Page ${selectedFoundPage.page}`
                    : "Page"}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                {selectedFoundPage && (
                  <Stack gap={4}>
                    <Box
                      fontSize="sm"
                      color="fg.muted"
                      lineHeight="1.4"
                      maxH="40svh"
                      overflowY="auto"
                      dangerouslySetInnerHTML={{
                        __html: selectedFoundPage.highlighted
                          .split(/\\./)
                          .join(". "),
                      }}
                    />
                    <Button
                      onClick={() => openFoundPage(selectedFoundPage.page)}
                    >
                      Open page
                    </Button>
                  </Stack>
                )}
              </Dialog.Body>
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root
        open={mobileDialogStack.length > 0}
        onOpenChange={(e) => {
          if (!e.open) {
            closeOneMobileDialog();
          }
        }}
        placement={{ base: "top", md: "center" }}
        size={{ base: "sm", md: currentMobileDialog === "pages" ? "xl" : "lg" }}
        scrollBehavior="inside"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner padding={{ base: 4, md: 4 }}>
            <Dialog.Content
              borderRadius={{ base: "xl", md: "xl" }}
              maxH={{ base: "80svh", md: "75vh" }}
              display={{ base: "flex", lg: "none" }}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Dialog.Header>
                <Stack
                  direction="row"
                  align="center"
                  justify="space-between"
                  width="full"
                  gap={2}
                >
                  <Button
                    size="xs"
                    variant="ghost"
                    visibility={
                      mobileDialogStack.length > 1 ? "visible" : "hidden"
                    }
                    onClick={closeOneMobileDialog}
                  >
                    Back
                  </Button>
                  <Dialog.Title
                    flex="1"
                    minW={0}
                    maxW={{ base: "12rem", sm: "16rem", md: "22rem" }}
                    whiteSpace="normal"
                    lineHeight="1.2"
                    css={{
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                    title={
                      currentMobileDialog === "tags"
                        ? "Change Tags"
                        : currentMobileDialog === "pageDetail"
                          ? `Page ${selectedFoundPage?.page || ""}`
                          : currentMobileDialog === "pages"
                            ? `Found pages (${props.pages?.length || 0})`
                            : props.name
                    }
                  >
                    {currentMobileDialog === "tags"
                      ? "Change Tags"
                      : currentMobileDialog === "pageDetail"
                        ? `Page ${selectedFoundPage?.page || ""}`
                        : currentMobileDialog === "pages"
                          ? `Found pages (${props.pages?.length || 0})`
                          : props.name}
                  </Dialog.Title>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={closeAllMobileDialogs}
                  >
                    Close
                  </Button>
                </Stack>
              </Dialog.Header>
              <Dialog.Body overflowY="auto">
                {currentMobileDialog === "actions" && (
                  <Stack gap={2}>
                    <Button
                      justifyContent="flex-start"
                      variant="outline"
                      onClick={() => {
                        downloadingBook(props.downloadPath, props.name);
                        closeAllMobileDialogs();
                      }}
                    >
                      <FaDownload /> Download
                    </Button>
                    <Button
                      justifyContent="flex-start"
                      variant="outline"
                      onClick={() => {
                        openContainingFolder();
                        closeAllMobileDialogs();
                      }}
                    >
                      Open containing folder
                    </Button>
                    {props.pages && props.pages.length > 0 && (
                      <Button
                        justifyContent="space-between"
                        variant="outline"
                        onClick={() => openMobileDialog("pages")}
                      >
                        <span>Found pages ({props.pages.length})</span>
                      </Button>
                    )}
                    <Button
                      justifyContent="space-between"
                      variant="outline"
                      onClick={() => openMobileDialog("tags")}
                    >
                      <span>Change Tags</span>
                      <LuChevronRight />
                    </Button>
                  </Stack>
                )}
                {currentMobileDialog === "pages" && (
                  <Grid
                    templateColumns={{
                      base: "repeat(2, minmax(0, 1fr))",
                      md: "repeat(3, minmax(0, 1fr))",
                    }}
                    gap={3}
                    pb={2}
                  >
                    {props.pages?.map((page) => (
                      <Box
                        key={page.page}
                        as="button"
                        textAlign="left"
                        padding={3}
                        borderWidth="1px"
                        borderRadius="lg"
                        bg="bg.panel"
                        _hover={{ bg: "bg.muted" }}
                        _active={{ transform: "scale(0.99)" }}
                        onClick={() => {
                          setSelectedFoundPage(page);
                          openMobileDialog("pageDetail");
                        }}
                        overflow={"auto"}
                      >
                        <Text fontWeight="semibold" mb={2}>
                          Page {page.page}
                        </Text>
                        <Box
                          fontSize="sm"
                          color="fg.muted"
                          lineHeight="1.35"
                          height={"10vh"}
                          dangerouslySetInnerHTML={{
                            __html: page.highlighted.split(/\\./).join(". "),
                          }}
                        />
                      </Box>
                    ))}
                  </Grid>
                )}
                {currentMobileDialog === "pageDetail" && selectedFoundPage && (
                  <Stack gap={4}>
                    <Box
                      fontSize="sm"
                      color="fg.muted"
                      lineHeight="1.4"
                      maxH="40svh"
                      overflowY="auto"
                      dangerouslySetInnerHTML={{
                        __html: selectedFoundPage.highlighted
                          .split(/\\./)
                          .join(". "),
                      }}
                    />
                    <Button
                      onClick={() => {
                        openFoundPage(selectedFoundPage.page);
                        closeAllMobileDialogs();
                      }}
                    >
                      Open page
                    </Button>
                  </Stack>
                )}
                {currentMobileDialog === "tags" && (
                  <TagList
                    itemTags={props.itemTags}
                    tags={tags}
                    path={props.path + "/" + props.name}
                    queryData={props.queryData}
                  />
                )}
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Menu.Root>
  );
}
