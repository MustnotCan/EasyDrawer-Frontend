import TagList from "./ItemViewTagList.tsx";
import { itemViewMenuPropsType } from "../types/types";
import { Menu, Portal } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";
import { CiMenuBurger } from "react-icons/ci";
import { downloadingBook } from "../utils/queries/booksApi.ts";
import { FaDownload } from "react-icons/fa6";
import { useTags } from "../utils/Hooks/TagsHook.ts";
import { useNavigate } from "react-router-dom";

export default function ItemViewMenu(props: itemViewMenuPropsType) {
  const tags = useTags();
  const navigate = useNavigate();
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
            <Menu.Item
              value="open containing folder"
              onClick={() => {
                if (props.path && props.path != "/") {
                  navigate("/multiTagger", {
                    state: [props.path, props.path + "/" + props.name],
                  });
                } else {
                  navigate("/multiTagger");
                }
              }}
            >
              Open containing folder
            </Menu.Item>
            {props.pages && (
              <Menu.Root positioning={{ placement: "right-start", gutter: 2 }}>
                <Menu.TriggerItem onDoubleClick={(e) => e.stopPropagation()}>
                  Found pages <LuChevronRight />
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content maxHeight={"20vh"}>
                      {props.pages?.map((page) => (
                        <Menu.Root
                          positioning={{
                            placement: "right-start",
                            gutter: 2,
                          }}
                          closeOnSelect={false}
                          key={page.page}
                        >
                          <Menu.TriggerItem
                            onClick={() => {
                              const encodedUri = encodeURIComponent(props.id);
                              const newWindow = window.open(
                                "http://" +
                                  location.host +
                                  `/pdfreader/${encodedUri}/${page.page || 1}`,
                                "_blank"
                              );
                              if (newWindow) {
                                newWindow.localStorage.setItem(
                                  props.id,
                                  props.name
                                );
                              }
                            }}
                          >
                            {page.page}
                          </Menu.TriggerItem>
                          <Portal>
                            <Menu.Positioner>
                              <Menu.Content
                                maxWidth={"30vw"}
                                maxHeight={"30vh"}
                                onDoubleClick={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                              >
                                page : {page.page}
                                <br />
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: page.highlighted,
                                  }}
                                />
                              </Menu.Content>
                            </Menu.Positioner>
                          </Portal>
                        </Menu.Root>
                      ))}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
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
                      path={props.path+"/"+props.name}
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
