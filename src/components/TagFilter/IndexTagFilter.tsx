import { CiMenuBurger } from "react-icons/ci";
import { useIndexes, useIndexTag } from "../../utils/Hooks/IndexHook";
import { IconButton, Menu, Portal } from "@chakra-ui/react";
import { Tooltip } from "../../ui/tooltip";

export default function IndexTagFilter(props: { currentTag: string }) {
  const indexes = useIndexes();
  const indexTag = useIndexTag();
  return (
    <Menu.Root positioning={{ placement: "right-start", gutter: 20 }}>
      <Menu.Trigger asChild>
        <IconButton variant={"ghost"} size="sm">
          <CiMenuBurger size={"20"}>
            <Tooltip content="Index"></Tooltip>
          </CiMenuBurger>
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <label>Choose an index :</label>
            {indexes.data?.map((index) => (
              <Menu.Item
                value={index.name}
                onClick={() =>
                  indexTag({ tag: props.currentTag, index: index.name })
                }
                key={index.name}
              >
                {index.name}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
