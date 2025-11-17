import { CiMenuBurger } from "react-icons/ci";
import { useIndexes, useIndexTag } from "../../utils/Hooks/IndexHook";
import { Alert, IconButton, Menu, Portal } from "@chakra-ui/react";
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
            {indexes.data && <label>Choose an index :</label>}
            {indexes.data ? (
              indexes.data?.map((index) => (
                <Menu.Item
                  value={index.name}
                  onClick={() =>
                    indexTag({ tag: props.currentTag, index: index.name })
                  }
                  key={index.name}
                >
                  {index.name}
                </Menu.Item>
              ))
            ) : (
              <Alert.Root status={"error"}>
                <Alert.Title>No index found</Alert.Title>
                <br />
                <Alert.Content>
                  Please make sure that meilisearch is running or add some index
                </Alert.Content>
              </Alert.Root>
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
