import TagAdder from "./TagAdder";
import { menuProps, tagType } from "../types/types";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, Portal } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";
import { CiMenuBurger } from "react-icons/ci";
import { downloadingBook } from "../utils/queries/booksApi.ts";
import { FaDownload } from "react-icons/fa6";

export default function ItemViewMenu(props: menuProps) {
  const queryClient = useQueryClient();

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
  const tags: tagType[] = queryClient.getQueryData(["tags"]) || [];
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
                    <TagAdder
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
