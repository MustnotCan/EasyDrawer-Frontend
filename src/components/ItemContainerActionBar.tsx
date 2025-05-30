import { FC } from "react";
import { selectedItem } from "../types/types";
import { clearSelected } from "../utils/itemContainerUtils";
import { ActionBar, Button, CloseButton, Menu, Portal } from "@chakra-ui/react";
import { CiMenuBurger } from "react-icons/ci";
import { LuChevronRight } from "react-icons/lu";

export function ItemContainerActionBar(props: {
  selectedItems: selectedItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItem[]>>;
  ItemContainerParent: string;
  setUnselectedItems: React.Dispatch<React.SetStateAction<selectedItem[]>>;
}) {
  type actionProps = { ItemContainerParent: string };
  const Actions: FC<actionProps> = (prop: actionProps) => {
    if (prop.ItemContainerParent == "MultiTagger") {
      return (
        <>
          <Menu.Root>
            <Menu.Trigger asChild onDoubleClick={(e) => e.stopPropagation()}>
              <CiMenuBurger size="25" />
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="rm-file">
                    Bad to remove a file from here
                  </Menu.Item>
                  <Menu.Root
                    positioning={{ placement: "right-start", gutter: 2 }}
                  >
                    <Menu.TriggerItem
                      onDoubleClick={(e) => e.stopPropagation()}
                    >
                      Change Tags <LuChevronRight />
                    </Menu.TriggerItem>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content></Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
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
    } else if (prop.ItemContainerParent == "ListItemView") {
      return (
        <>
          <Button variant="outline" size="sm">
            Definetely ListITemView
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log(props.selectedItems)}
          >
            {props.selectedItems.length}
          </Button>
        </>
      );
    } else {
      <>hi</>;
    }
  };
  return (
    <ActionBar.Root
      open={props.selectedItems.length > 0}
      closeOnInteractOutside={false}
    >
      <Portal>
        <ActionBar.Positioner className="z-1">
          <ActionBar.Content>
            <ActionBar.SelectionTrigger></ActionBar.SelectionTrigger>
            <ActionBar.Separator />
            <Actions ItemContainerParent={props.ItemContainerParent} />
            <ActionBar.CloseTrigger
              asChild
              onClick={() => {
                clearSelected(props.setSelectedItems);
                clearSelected(props.setUnselectedItems);
              }}
            >
              <CloseButton size="sm" />
            </ActionBar.CloseTrigger>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
