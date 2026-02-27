import {
  Box,
  Button,
  Dialog,
  IconButton,
  Menu,
  Portal,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { CiMenuBurger } from "react-icons/ci";
import { LuChevronRight } from "react-icons/lu";
import TagList from "./ItemViewTagList";
import { useState } from "react";
import {
  itemViewSelectedType,
  listItemViewQueryDataType,
  selectedItemType,
  tagType,
} from "../types/types";
import { useQueryClient } from "@tanstack/react-query";
import { getSelectedFilesDetailsItemView } from "../utils/queries/booksApi";
import { useTags } from "../utils/Hooks/TagsHook";

export function ItemViewActionBar(props: {
  selectedItems: selectedItemType[];
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItemType[]>>;
  queryData: listItemViewQueryDataType;
}) {
  type MobileView = "menu" | "tags";
  const [sharedTags, setSharedTags] = useState<tagType[]>([]);
  const [unsharedTags, setUnsharedTags] = useState<tagType[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<itemViewSelectedType[]>([]);
  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>("menu");

  const tags = useTags();
  const queryClient = useQueryClient();
  const loadSelectionDetails = async () => {
    setLoading(true);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: ["ItemViewMultiTagging", props.selectedItems],
        queryFn: ({ queryKey }) =>
          getSelectedFilesDetailsItemView({
            selected: queryKey.at(1) as selectedItemType[],
          }),
      });
      if (!response) return;
      setData(response);
      const taggsWithLength = tags.map((tag) => {
        const count = response.filter((file) =>
          file.tags.map((t) => t.name).includes(tag.name),
        ).length;

        return { tag, length: count };
      });

      const shared = taggsWithLength
        .filter((t) => t.length === response.length)
        .map((t) => t.tag);

      const unshared = taggsWithLength
        .filter((t) => t.length === 0)
        .map((t) => t.tag);

      setSharedTags(shared);
      setUnsharedTags(unshared);
    } catch (error) {
      console.error("Query failed:", error);
    } finally {
      setLoading(false);
    }
  };
  const clickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await loadSelectionDetails();
  };

  return (
    <>
      <Box display={{ base: "inline-flex", lg: "none" }}>
        <IconButton
          onClick={async (e) => {
            e.stopPropagation();
            setMobileView("menu");
            setIsMobileDialogOpen(true);
            await loadSelectionDetails();
          }}
          onDoubleClick={(e) => e.stopPropagation()}
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          minW="2.25rem"
          minH="2.25rem"
        >
          <CiMenuBurger size="25" />
        </IconButton>
      </Box>

      <Dialog.Root
        open={isMobileDialogOpen}
        onOpenChange={(e) => {
          setIsMobileDialogOpen(e.open);
          if (!e.open) setMobileView("menu");
        }}
        placement={{ base: "top", md: "center" }}
        size={{ base: "sm", md: "lg" }}
        scrollBehavior="inside"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner padding={{ base: 4, md: 4 }}>
            <Dialog.Content
              display={{ base: "flex", lg: "none" }}
              borderRadius="xl"
              maxH={{ base: "80svh", md: "70vh" }}
            >
              <Dialog.Header>
                <Stack
                  direction="row"
                  width="full"
                  justify="space-between"
                  align="center"
                >
                  <Button
                    size="xs"
                    variant="ghost"
                    visibility={mobileView === "tags" ? "visible" : "hidden"}
                    onClick={() => setMobileView("menu")}
                  >
                    Back
                  </Button>
                  <Dialog.Title>
                    {mobileView === "tags" ? "Change Tags" : "Actions"}
                  </Dialog.Title>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => {
                      setIsMobileDialogOpen(false);
                      setMobileView("menu");
                    }}
                  >
                    Close
                  </Button>
                </Stack>
              </Dialog.Header>
              <Dialog.Body overflowY="auto">
                {mobileView === "menu" ? (
                  <Button
                    justifyContent="space-between"
                    variant="outline"
                    width="full"
                    onClick={() => setMobileView("tags")}
                  >
                    <span>Change Tags</span>
                    <LuChevronRight />
                  </Button>
                ) : loading ? (
                  <Spinner />
                ) : (
                  <TagList
                    tags={tags}
                    sharedTags={sharedTags}
                    unsharedTags={unsharedTags}
                    data={data.map((dt) => dt.path + "/" + dt.title)}
                    queryData={[...props.queryData]}
                  />
                )}
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Menu.Root>
        <Menu.Trigger
          asChild
          onClick={clickHandler}
          onDoubleClick={(e) => {
            e.stopPropagation();
          }}
        >
          <IconButton
            display={{ base: "none", lg: "inline-flex" }}
            alignItems="center"
            justifyContent="center"
            minW="2.25rem"
            minH="2.25rem"
          >
            <CiMenuBurger size="25" />
          </IconButton>
        </Menu.Trigger>

        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Root positioning={{ placement: "top" }}>
                <Menu.TriggerItem onDoubleClick={(e) => e.stopPropagation()}>
                  Change Tags <LuChevronRight />
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner
                    zIndex={120}
                    maxWidth={{ base: "100vw", md: "auto" }}
                  >
                    <Menu.Content
                      minWidth={0}
                      maxWidth={{ base: "92vw", md: "sm" }}
                      width={{ base: "35vw", md: "auto" }}
                      maxHeight={{ base: "55svh", md: "70vh" }}
                      overflowX={"hidden"}
                      overflowY={"auto"}
                    >
                      {loading ? (
                        <Spinner />
                      ) : (
                        <TagList
                          tags={tags}
                          sharedTags={sharedTags}
                          unsharedTags={unsharedTags}
                          data={data.map((dt) => dt.path + "/" + dt.title)}
                          queryData={[...props.queryData]}
                        />
                      )}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </>
  );
}
