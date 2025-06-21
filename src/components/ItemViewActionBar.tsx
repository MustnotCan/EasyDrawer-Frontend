import { Button, Menu, Portal, Spinner } from "@chakra-ui/react";
import { CiMenuBurger } from "react-icons/ci";
import { LuChevronRight } from "react-icons/lu";
import TagAdder from "./TagAdder";
import { useState } from "react";
import { onlyPathAndTags, selectedItem, tagType } from "../types/types";
import {} from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSelectedFilesDetails } from "../utils/queries/booksApi";
import { getTags } from "../utils/queries/tagsApi";

export function ItemViewActionBar(props: {
  selectedItems: selectedItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItem[]>>;
}) {
  const tags = useQuery({ queryKey: ["tags"], queryFn: getTags })
    .data as tagType[];
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
        queryKey: ["ItemViewMultiTagging", props.selectedItems],
        queryFn: ({ queryKey }) =>
          getSelectedFilesDetails({
            selected: queryKey.at(1) as selectedItem[],
            unselected: [] as selectedItem[],
          }),
      });

      if (!response) return;
      setData(response);
      const taggsWithLength = tags.map((tag) => {
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
                            tags={tags}
                            sharedTags={sharedTags}
                            unsharedTags={unsharedTags}
                            data={data.map((dt) => dt.fullpath)}
                            queryData={["multiTagger", props.selectedItems, []]}
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
