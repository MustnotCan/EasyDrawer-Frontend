import { FC } from "react";
import { selectedItem } from "../types/types";
import { clearSelected } from "../utils/itemContainerUtils";
import { ActionBar, Button, CloseButton, Portal } from "@chakra-ui/react";

export function ItemContainerActionBar(props: {
  selectedItems: selectedItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItem[]>>;
  ItemContainerParent: string;
}) {
  const { folderCount, fileCount } = props.selectedItems.reduce(
    (counts, item) => {
      if (item.type === "folder") counts.folderCount++;
      if (item.type === "file") counts.fileCount++;
      return counts;
    },
    { folderCount: 0, fileCount: 0 }
  );
  type props = { ItemContainerParent: string };
  const Actions: FC<props> = (props: props) => {
    if (props.ItemContainerParent == "MultiTagger") {
      return (
        <>
          <Button variant="outline" size="sm">
            Definetely multitagger
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("how many are we")}
          >
            how many are we{" "}
          </Button>
        </>
      );
    } else if (props.ItemContainerParent == "ListItemView") {
      return (
        <>
          <Button variant="outline" size="sm">
            Definetely ListITemView
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("how many are we")}
          >
            how many are we{" "}
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
            <ActionBar.SelectionTrigger>
              {folderCount > 0 &&
                `${folderCount} folder${folderCount > 1 ? "s" : ""}  `}
              {folderCount > 0 && fileCount > 0 && " & "}
              {fileCount > 0 && `${fileCount} file${fileCount > 1 ? "s" : ""} `}
              selected
            </ActionBar.SelectionTrigger>
            <ActionBar.Separator />
            <Actions ItemContainerParent={props.ItemContainerParent} />
            <ActionBar.CloseTrigger
              asChild
              onClick={() => clearSelected(props.setSelectedItems)}
            >
              <CloseButton size="sm" />
            </ActionBar.CloseTrigger>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
