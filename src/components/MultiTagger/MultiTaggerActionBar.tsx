import {
  itemViewPropsType,
  onlyPathAndTagsType,
  selectedItemType,
  tagType,
} from "../../types/types";
import { Button, Input, Menu, Portal, Spinner, Stack } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CiMenuBurger } from "react-icons/ci";
import { LuChevronRight } from "react-icons/lu";
import TagAdder from "../TagAdder";
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
  const [sharedTags, setSharedTags] = useState<tagType[]>([]);
  const [unsharedTags, setUnsharedTags] = useState<tagType[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<onlyPathAndTagsType[]>([]);
  const queryClient = useQueryClient();

  const clickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
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
          file.tags.map((t) => t.name).includes(tag.name)
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
          ["Dirs&files", file.split("/").slice(0, -1)],
          (prev: (string | itemViewPropsType)[] | undefined) => {
            return prev
              ? [
                  ...prev.filter(
                    (item) =>
                      typeof item == "string" ||
                      item.title != splittedFile.at(splittedFile.length - 1)
                  ),
                ]
              : [];
          }
        );
      });
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
      addedFiles: itemViewPropsType[],
      variables: { files: string[]; newPath: string }
    ) => {
      queryClient.setQueryData(
        ["Dirs&files", props.dirs],
        (prev: (string | itemViewPropsType)[] | undefined) => {
          if (!prev) {
            return [...addedFiles];
          } else {
            const existingFiles = prev
              .filter((file) => !(typeof file == "string"))
              .map((file) => file.title);
            return [
              ...prev,
              ...addedFiles.filter(
                (file) => !existingFiles.includes(file.title)
              ),
            ].sort();
          }
        }
      );
      const pathsToUpdate = Array.from(
        new Set(addedFiles.map((af) => af.path))
      );
      pathsToUpdate.forEach((pto) => {
        const fullArray = pto.split("/");
        fullArray.slice(0, fullArray.length - 1).forEach((_, index, arr) => {
          const existingCache = queryClient.getQueryData([
            "Dirs&files",
            arr.slice(0, index + 1),
          ]) as (string | itemViewPropsType)[] | undefined;
          if (
            fullArray[index + 1] &&
            (!existingCache ||
              !existingCache.find(
                (el) => typeof el == "string" && el == fullArray[index + 1]
              ))
          ) {
            queryClient.setQueryData(
              ["Dirs&files", arr.slice(0, index + 1)],
              (prev: (string | itemViewPropsType)[] | undefined) => {
                if (!prev) {
                  return [fullArray[index + 1]];
                } else {
                  return [...prev, fullArray[index + 1]];
                }
              }
            );
          }
        });
      });

      //
      variables.files.forEach((file) => {
        const splittedFile = file.split("/");
        queryClient.setQueryData(
          ["Dirs&files", file.split("/").slice(0, -1)],
          (prev: (string | itemViewPropsType)[] | undefined) => {
            return prev
              ? [
                  ...prev.filter(
                    (item) =>
                      typeof item == "string" ||
                      item.title != splittedFile.at(splittedFile.length - 1)
                  ),
                ]
              : [];
          }
        );
      });
    },
  });
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
          file.fullpath.slice(0, file.fullpath.lastIndexOf("/")) != actualDir
      )
      .map((file) => file.fullpath);
    moveMutation.mutate({
      files: files,
      newPath: actualDir || "/",
    });

    props.setSelectedItems([]);
    props.setUnselectedItems([]);
  };
  return (
    <>
      <Menu.Root>
        <Menu.Trigger
          asChild
          onClick={clickHandler}
          onDoubleClick={(e) => {
            e.stopPropagation();
          }}
        >
          <CiMenuBurger size="25" />
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
                          <TagAdder
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
