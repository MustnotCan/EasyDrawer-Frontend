import { FC } from "react";
import { selectedItem, tagType } from "../../types/types";
import { clearSelected } from "../../utils/itemContainerUtils";
import { ActionBar, CloseButton, Portal } from "@chakra-ui/react";

import { MultiTaggerActionBar } from "../MultiTagger/MultiTaggerActionBar";
import { ItemViewActionBar } from "../ItemViewActionBar";
export function ItemContainerActionBar(props: {
  selectedItems: selectedItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItem[]>>;
  ItemContainerParent: string;
  setUnselectedItems: React.Dispatch<React.SetStateAction<selectedItem[]>>;
  unselectedItems: selectedItem[];
  tags: tagType[];
  setDir: React.Dispatch<React.SetStateAction<string[]>>;
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
        />
      );
    } else if (prop.ItemContainerParent == "ListItemView") {
      return (
        <ItemViewActionBar
          selectedItems={props.selectedItems}
          setSelectedItems={props.setSelectedItems}
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
        <ActionBar.Positioner className="z-1">
          <ActionBar.Content>
            <Actions ItemContainerParent={props.ItemContainerParent} />
            <ActionBar.CloseTrigger asChild onClick={closeClickHandler}>
              <CloseButton size="sm" />
            </ActionBar.CloseTrigger>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
