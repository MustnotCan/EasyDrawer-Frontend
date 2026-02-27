import {
  multiTaggerFilePropsType,
  onlyPathAndTagsType,
  selectedItemType,
  tagType,
} from "../../types/types";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Input,
  Menu,
  Portal,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CiMenuBurger } from "react-icons/ci";
import { LuChevronRight } from "react-icons/lu";
import TagList from "../ItemViewTagList";
import {
  getSelectedFilesDetails,
  multiDelete,
  multiMove,
} from "../../utils/queries/booksApi";
import { useState } from "react";
function MultiTaggerActionBarInput(props: {
  moveClickHandler: (newDir: string) => void;
}) {
  const [input, setInput] = useState<string>("");
  return (
    <Stack direction={"row"}>
      <Input
        title="Folder name"
        placeholder="Folder name"
        onChange={(e) => setInput(e.currentTarget.value)}
        onKeyUp={(e) => {
          if (e.key == "Enter") {
            props.moveClickHandler(input);
          }
        }}
      />

      <Button
        onClick={(e) => {
          e.preventDefault();
          props.moveClickHandler(input);
        }}
      >
        Ok
      </Button>
    </Stack>
  );
}
export function MultiTaggerActionBar(props: {
  selectedItems: selectedItemType[];
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItemType[]>>;
  setUnselectedItems: React.Dispatch<React.SetStateAction<selectedItemType[]>>;
  unselectedItems: selectedItemType[];
  tags: tagType[];
  setDir: React.Dispatch<React.SetStateAction<string[]>>;
  dirs: string[];
}) {
  type MobileView = "menu" | "move" | "move_new" | "tags";
  const [sharedTags, setSharedTags] = useState<tagType[]>([]);
  const [unsharedTags, setUnsharedTags] = useState<tagType[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<onlyPathAndTagsType[]>([]);
  const [mobileDialogStack, setMobileDialogStack] = useState<MobileView[]>([]);
  const queryClient = useQueryClient();

  const loadSelectionDetails = async () => {
    setLoading(true);

    try {
      const response = await queryClient.fetchQuery({
        queryKey: ["multiTagger", props.selectedItems, props.unselectedItems],
        queryFn: ({ queryKey }) =>
          getSelectedFilesDetails({
            selected: queryKey.at(1) as selectedItemType[],
            unselected: queryKey.at(2) as selectedItemType[],
          }),
      });

      if (!response) return;
      setData(response);
      const taggsWithLength = props.tags.map((tag) => {
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
  const removeMutation = useMutation({
    mutationFn: (args: { files: string[] }) => {
      return multiDelete({
        data: args.files,
      });
    },
    onSuccess: (_, variables: { files: string[] }) => {
      variables.files.forEach((file) => {
        const splittedFile = file.split("/");
        queryClient.setQueryData(
          ["Dirs&files", splittedFile.slice(0, -1)],
          (prev: (string | multiTaggerFilePropsType)[] | undefined) => {
            return prev
              ? [
                  ...prev.filter(
                    (item) =>
                      typeof item == "string" ||
                      item.title != splittedFile.at(splittedFile.length - 1),
                  ),
                ]
              : [];
          },
        );
      });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
  const moveMutation = useMutation({
    mutationFn: (args: { files: string[]; newPath: string }) => {
      return multiMove({
        data: args.files,
        newPath: args.newPath,
      });
    },
    onSuccess: (
      addedFiles: multiTaggerFilePropsType[],
      variables: { files: string[]; newPath: string },
    ) => {
      const pathsToUpdate = Array.from(
        new Set(addedFiles.map((af) => (af.path != "/" ? af.path : ""))),
      );
      pathsToUpdate.forEach((pto) => {
        const fullArray = pto.split("/");
        fullArray.slice(0, fullArray.length - 1).forEach((_, index, arr) => {
          const existingCache = queryClient.getQueryData([
            "Dirs&files",
            arr.slice(0, index + 1),
          ]) as (string | multiTaggerFilePropsType)[] | undefined;
          if (
            fullArray[index + 1] &&
            (!existingCache ||
              !existingCache.find(
                (el) => typeof el == "string" && el == fullArray[index + 1],
              ))
          ) {
            queryClient.setQueryData(
              ["Dirs&files", arr.slice(0, index + 1)],
              (prev: (string | multiTaggerFilePropsType)[] | undefined) => {
                if (!prev) {
                  return [fullArray[index + 1]];
                } else {
                  return [...prev, fullArray[index + 1]];
                }
              },
            );
          }
        });
      });

      // update the cache for the folder from where files were removed
      variables.files.forEach((file) => {
        const splittedFile = file.split("/");
        queryClient.setQueryData(
          ["Dirs&files", file.split("/").slice(0, -1)],
          (prev: (string | multiTaggerFilePropsType)[] | undefined) => {
            return prev
              ? [
                  ...prev.filter(
                    (item) =>
                      typeof item == "string" ||
                      item.title != splittedFile.at(splittedFile.length - 1),
                  ),
                ]
              : [];
          },
        );
      });

      // basically, when you move files into a new dir, you do that to the new dir, the next code updates the files in it
      queryClient.setQueryData(
        ["Dirs&files", pathsToUpdate.at(0)?.split("/")],
        (prev: (string | multiTaggerFilePropsType)[] | undefined) => {
          if (prev) {
            const existingFiles = prev
              .filter((file) => !(typeof file == "string"))
              .map((file) => file.title);
            return [
              ...prev,
              ...addedFiles.filter(
                (file) => !existingFiles.includes(file.title),
              ),
            ].sort();
          }
        },
      );
    },
  });
  const queryData = queryClient.getQueryData(["Dirs&files", props.dirs]) as
    | (string | multiTaggerFilePropsType)[]
    | undefined;

  const dirNames = Array.isArray(queryData)
    ? queryData.filter((item): item is string => typeof item === "string")
    : [];
  const removeClickHandler = () => {
    removeMutation.mutate({
      files: data.map((file) => file.fullpath),
    });
    props.setSelectedItems(() => []);
    props.setUnselectedItems(() => []);
  };
  const moveClickHandler = (newDir?: string) => {
    let actualDir;
    if (newDir) {
      actualDir = [...props.dirs, newDir].join("/");
    } else {
      actualDir = [...props.dirs].join("/");
    }

    const files = data
      .filter(
        (file) =>
          file.fullpath.slice(0, file.fullpath.lastIndexOf("/")) != actualDir,
      )
      .map((file) => file.fullpath);
    moveMutation.mutate({
      files: files,
      newPath: actualDir || "/",
    });

    props.setSelectedItems([]);
    props.setUnselectedItems([]);
  };
  const openMobileDialog = (view: MobileView) =>
    setMobileDialogStack((prev) => [...prev, view]);
  const closeOneMobileDialog = () =>
    setMobileDialogStack((prev) => prev.slice(0, -1));
  const closeAllMobileDialogs = () => setMobileDialogStack([]);
  const currentMobileDialog = mobileDialogStack[mobileDialogStack.length - 1];
  return (
    <>
      <Box display={{ base: "inline-flex", lg: "none" }}>
        <IconButton
          onClick={async (e) => {
            e.stopPropagation();
            setMobileDialogStack(["menu"]);
            await loadSelectionDetails();
          }}
          onDoubleClick={(e) => e.stopPropagation()}
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          minW="2.25rem"
          minH="2.25rem"
          variant={"ghost"}
        >
          <CiMenuBurger size="25" />
        </IconButton>
      </Box>

      <Dialog.Root
        open={mobileDialogStack.length > 0}
        onOpenChange={(e) => {
          if (!e.open) closeOneMobileDialog();
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
              maxH={{ base: "80svh", md: "75vh" }}
            >
              <Dialog.Header>
                <Stack
                  direction="row"
                  align="center"
                  justify="space-between"
                  width="full"
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
                  <Dialog.Title>
                    {currentMobileDialog === "move"
                      ? "Move"
                      : currentMobileDialog === "move_new"
                        ? "Move to a New Folder"
                        : currentMobileDialog === "tags"
                          ? "Change Tags"
                          : "Actions"}
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
                {currentMobileDialog === "menu" && (
                  <Stack gap={2}>
                    <Button
                      variant="outline"
                      justifyContent="flex-start"
                      disabled={loading}
                      onClick={() => {
                        removeClickHandler();
                        closeAllMobileDialogs();
                      }}
                    >
                      Remove Selected Files
                    </Button>
                    <Button
                      variant="outline"
                      justifyContent="space-between"
                      disabled={loading}
                      onClick={() => openMobileDialog("move")}
                    >
                      <span>Move</span>
                      <LuChevronRight />
                    </Button>
                    <Button
                      variant="outline"
                      justifyContent="space-between"
                      disabled={loading}
                      onClick={() => openMobileDialog("tags")}
                    >
                      <span>Change Tags</span>
                      <LuChevronRight />
                    </Button>
                    {loading && <Spinner size="sm" />}
                  </Stack>
                )}
                {currentMobileDialog === "move" && (
                  <Stack gap={2}>
                    {dirNames.map((item) => (
                      <Button
                        key={item}
                        variant="outline"
                        justifyContent="flex-start"
                        onClick={() => {
                          moveClickHandler(item);
                          closeAllMobileDialogs();
                        }}
                      >
                        Move to : {item}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      justifyContent="flex-start"
                      onClick={() => {
                        moveClickHandler();
                        closeAllMobileDialogs();
                      }}
                    >
                      Move Here
                    </Button>
                    <Button
                      variant="outline"
                      justifyContent="space-between"
                      onClick={() => openMobileDialog("move_new")}
                    >
                      <span>Move to a new folder</span>
                      <LuChevronRight />
                    </Button>
                  </Stack>
                )}
                {currentMobileDialog === "move_new" && (
                  <MultiTaggerActionBarInput
                    moveClickHandler={(newDir) => {
                      moveClickHandler(newDir);
                      closeAllMobileDialogs();
                    }}
                  />
                )}
                {currentMobileDialog === "tags" &&
                  (loading ? (
                    <Spinner />
                  ) : (
                    <TagList
                      tags={props.tags}
                      sharedTags={sharedTags}
                      unsharedTags={unsharedTags}
                      data={data.map((dt) => dt.fullpath)}
                      queryData={[
                        "multiTagger",
                        props.selectedItems,
                        props.unselectedItems,
                      ]}
                      isMultiTag={true}
                    />
                  ))}
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
            variant={"subtle"}
          >
            <CiMenuBurger size="25" />
          </IconButton>
        </Menu.Trigger>

        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <>
                <Menu.Item value="rm-files" onClick={removeClickHandler}>
                  Remove Selected Files
                </Menu.Item>
                <Menu.Root
                  positioning={{ placement: "right-start", gutter: 2 }}
                >
                  <Menu.TriggerItem onDoubleClick={(e) => e.stopPropagation()}>
                    Move <LuChevronRight />
                  </Menu.TriggerItem>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        <Stack>
                          {dirNames.map((item) => (
                            <Menu.Item
                              value={item}
                              onClick={() => moveClickHandler(item)}
                              key={item}
                            >
                              Move to : {item}
                            </Menu.Item>
                          ))}
                        </Stack>
                        <Menu.Item
                          value="mv-here"
                          onClick={() => moveClickHandler()}
                        >
                          Move Here
                        </Menu.Item>
                        <Menu.Root
                          positioning={{ placement: "right-start", gutter: 2 }}
                        >
                          <Menu.TriggerItem
                            onDoubleClick={(e) => e.stopPropagation()}
                          >
                            Move to a new folder <LuChevronRight />
                          </Menu.TriggerItem>
                          <Portal>
                            <Menu.Positioner>
                              <Menu.Content>
                                <MultiTaggerActionBarInput
                                  moveClickHandler={moveClickHandler}
                                />
                              </Menu.Content>
                            </Menu.Positioner>
                          </Portal>
                        </Menu.Root>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
                <Menu.Root positioning={{ placement: "right-start" }}>
                  <Menu.TriggerItem onDoubleClick={(e) => e.stopPropagation()}>
                    Change Tags <LuChevronRight />
                  </Menu.TriggerItem>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        {loading ? (
                          <Spinner />
                        ) : (
                          <TagList
                            tags={props.tags}
                            sharedTags={sharedTags}
                            unsharedTags={unsharedTags}
                            data={data.map((dt) => dt.fullpath)}
                            queryData={[
                              "multiTagger",
                              props.selectedItems,
                              props.unselectedItems,
                            ]}
                            isMultiTag={true}
                          />
                        )}
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </>
  );
}
