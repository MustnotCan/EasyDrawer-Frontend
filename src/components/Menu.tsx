import TagList from "./ItemViewTagList.tsx";
import { itemViewMenuPropsType } from "../types/types";
import { Menu, Portal } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";
import { CiMenuBurger } from "react-icons/ci";
import { downloadingBook } from "../utils/queries/booksApi.ts";
import { FaDownload } from "react-icons/fa6";
import { useTags } from "../utils/Hooks/TagsHook.ts";

export default function ItemViewMenu(props: itemViewMenuPropsType) {
  const tags = useTags();
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
      <Menu.Trigger asChild onDoubleClick={(e) => e.stopPropagation()}>
        <CiMenuBurger size="25" />
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item
              value="download"
              onClick={() => downloadingBook(props.downloadPath, props.name)}
            >
              <FaDownload /> Download
            </Menu.Item>
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
                      name={props.name}
                      queryData={props.queryData}
                    />
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
