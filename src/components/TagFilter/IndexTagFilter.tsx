import { CiMenuBurger } from "react-icons/ci";
import { useIndexes, useIndexTag } from "../../utils/Hooks/IndexHook";
import { Alert, IconButton, Menu, Portal } from "@chakra-ui/react";
import { Tooltip } from "../../ui/tooltip";

export default function IndexTagFilter(props: {
  currentTag: string;
  disableMenuPortal?: boolean;
}) {
  const indexes = useIndexes();
  const indexTag = useIndexTag();
  return (
    <Menu.Root
      positioning={{
        placement: "right",
        gutter: 0,
        offset: { mainAxis: 0, crossAxis: 0 },
      }}
    >
      <Menu.Trigger asChild>
        <IconButton variant={"ghost"} size={{ base: "xs" }}>
          <CiMenuBurger>
            <Tooltip content="Index"></Tooltip>
          </CiMenuBurger>
        </IconButton>
      </Menu.Trigger>
      <Portal disabled={props.disableMenuPortal}>
        <Menu.Positioner>
          <Menu.Content padding={{ base: "1", md: "2" }}>
            {indexes.data && <label>Choose an index :</label>}
            {indexes.data ? (
              indexes.data?.map((index) => (
                <Menu.Item
                  value={index.name}
                  fontSize={{ base: "xs", md: "sm" }}
                  minH={{ base: "1.75rem", md: "2rem" }}
                  px={{ base: 1.5, md: 2.5 }}
                  py={{ base: 0.5, md: 1 }}
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
