import { onlyPathAndTags, selectedItem, tagType } from "../../types/types";
import { Button, Menu, Portal, Spinner } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CiMenuBurger } from "react-icons/ci";
import { LuChevronRight } from "react-icons/lu";
import TagAdder from "../TagAdder";
import {
  getSelectedFilesDetails,
  multiDelete,
} from "../../utils/queries/booksApi";
import { useState } from "react";

export function MultiTaggerActionBar(props: {
  selectedItems: selectedItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItem[]>>;
  setUnselectedItems: React.Dispatch<React.SetStateAction<selectedItem[]>>;
  unselectedItems: selectedItem[];
  tags: tagType[];
  setDir: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [sharedTags, setSharedTags] = useState<tagType[]>([]);
  const [unsharedTags, setUnsharedTags] = useState<tagType[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<onlyPathAndTags[]>([]);
  const queryClient = useQueryClient();

  const clickHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLoading(true);

    try {
      const response = await queryClient.fetchQuery({
        queryKey: ["multiTagger", props.selectedItems, props.unselectedItems],
        queryFn: ({ queryKey }) =>
          getSelectedFilesDetails({
            selected: queryKey.at(1) as selectedItem[],
            unselected: queryKey.at(2) as selectedItem[],
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
    onSuccess: () => {
      props.setDir([""]);
      props.setSelectedItems([]);
      props.setUnselectedItems([]);
    },
  });
  const removeClickHandler = () => {
    removeMutation.mutate({
      files: data.map((file) => file.fullpath),
    });
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
                <Menu.Item value="rm-file" onClick={removeClickHandler}>
                  Remove Selected Files
                </Menu.Item>
                <Menu.Root
                  positioning={{ placement: "right-start", gutter: 2 }}
                >
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
      <Button
        variant="outline"
        size="sm"
        onClick={() => console.log(props.selectedItems)}
      >
        how many are we{" "}
      </Button>
    </>
  );
}
