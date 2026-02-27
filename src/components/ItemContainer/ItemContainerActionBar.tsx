import { FC } from "react";
import {
  listItemViewQueryDataType,
  selectedItemType,
  tagType,
} from "../../types/types";
import { clearSelected } from "../../utils/itemContainerUtils";
import { ActionBar, Box, CloseButton, Portal } from "@chakra-ui/react";

import { MultiTaggerActionBar } from "../MultiTagger/MultiTaggerActionBar";
import { ItemViewActionBar } from "../ItemViewActionBar";
export function ItemContainerActionBar(props: {
  selectedItems: selectedItemType[];
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItemType[]>>;
  ItemContainerParent: string;
  setUnselectedItems: React.Dispatch<React.SetStateAction<selectedItemType[]>>;
  unselectedItems: selectedItemType[];
  tags: tagType[];
  setDir: React.Dispatch<React.SetStateAction<string[]>>;
  dirs: string[];
  queryData?: listItemViewQueryDataType;
}) {
  type actionProps = { ItemContainerParent: string };
  const Actions: FC<actionProps> = (prop: actionProps) => {
    if (prop.ItemContainerParent == "MultiTagger") {
      return (
        <MultiTaggerActionBar
          selectedItems={props.selectedItems}
          setSelectedItems={props.setSelectedItems}
          unselectedItems={props.unselectedItems}
          setUnselectedItems={props.setUnselectedItems}
          tags={props.tags}
          setDir={props.setDir}
          dirs={props.dirs}
        />
      );
    } else if (prop.ItemContainerParent == "ListItemView") {
      return (
        <ItemViewActionBar
          selectedItems={props.selectedItems}
          setSelectedItems={props.setSelectedItems}
          queryData={props.queryData!}
        />
      );
    }
  };
  const closeClickHandler = () => {
    clearSelected(props.setSelectedItems);
    clearSelected(props.setUnselectedItems);
  };
  return (
    <ActionBar.Root
      open={props.selectedItems.length > 0}
      closeOnInteractOutside={false}
    >
      <Portal>
        <Box
          position={{ base: "fixed", lg: "static" }}
          insetX={0}
          top={{ base: 0, lg: "auto" }}
          height={{ base: "100dvh", lg: "auto" }}
          pointerEvents={"none"}
        >
          <ActionBar.Positioner
            zIndex={110}
            position={{ base: "absolute", lg: "fixed" }}
            insetX={{ base: 0, lg: undefined }}
            bottom={{ base: 0, lg: undefined }}
            paddingBottom={{ base: "env(safe-area-inset-bottom)", lg: 0 }}
            pointerEvents={"none"}
          >
            <ActionBar.Content
              pointerEvents={"auto"}
              borderTopWidth={{ base: "1px", lg: 0 }}
              borderColor={{ base: "gray.200", lg: "transparent" }}
              borderRadius={{ base: 0, lg: "md" }}
              boxShadow={{ base: "0 -8px 24px rgba(0,0,0,0.12)", lg: "md" }}
              background={{ base: "white", lg: undefined }}
              justifyContent={"center"}
              padding={{ base: "0.5rem" }}
            >
              <Actions ItemContainerParent={props.ItemContainerParent} />
              <ActionBar.CloseTrigger asChild onClick={closeClickHandler}>
                <CloseButton size="sm" />
              </ActionBar.CloseTrigger>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Box>
      </Portal>
    </ActionBar.Root>
  );
}
