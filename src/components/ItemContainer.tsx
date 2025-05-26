import { Stack } from "@chakra-ui/react";
import {
  itemView,
  multiTaggerFileProps,
  multiTaggerFolderProps,
  selectedItem,
} from "../types/types";
import {
  isItemView,
  isMultiTaggerFileProps,
  isMultiTaggerFolderProps,
} from "../utils/guards.ts";
import { toggleSelected } from "../utils/itemContainerUtils";

export function ItemContainer(props: {
  children: React.ReactElement<
    itemView | multiTaggerFileProps | multiTaggerFolderProps
  >;
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItem[]>>;
  selected: boolean;
  selectedItems: selectedItem[];
}) {
  const clickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.ctrlKey) {
      if (isItemView(props.children)) {
        toggleSelected(
          { path: props.children.props.itemView.prop.title, type: "file" },
          props.selectedItems,
          props.setSelectedItems
        );
      } else if (isMultiTaggerFileProps(props.children)) {
        toggleSelected(
          {
            path:
              props.children.props.item.path +
              "/" +
              props.children.props.item.title,
            type: "file",
          },
          props.selectedItems,
          props.setSelectedItems
        );
      } else if (isMultiTaggerFolderProps(props.children)) {
        toggleSelected(
          {
            path: props.children.props.path,
            type: "folder",
          },
          props.selectedItems,
          props.setSelectedItems
        );
      }
    }
  };

  const onDoubleClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!e.ctrlKey) {
      if (isItemView(props.children)) {
        const prop = props.children.props.itemView.prop;
        const encodedUri = encodeURIComponent(prop.path + "/" + prop.title);
        window.open(
          "http://" + location.host + `/pdfreader/${encodedUri}`,
          "_blank"
        );
      } else if (isMultiTaggerFileProps(props.children)) {
        const prop = props.children.props.item;
        const encodedUri = encodeURIComponent(prop.path + "/" + prop.title);
        window.open(
          "http://" + location.host + `/pdfreader/${encodedUri}`,
          "_blank"
        );
      } else if (isMultiTaggerFolderProps(props.children)) {
        // what happens if a folder is double clicked ?
        const item = props.children.props.item;
        props.children.props.setDir((dirs) => [...dirs, item]);
      }
    }
  };

  return (
    <>
      <Stack
        className={
          "hover:cursor-pointer " + (props.selected ? "opacity-50" : "")
        }
        onClick={(e) => {
          clickHandler(e);
        }}
        onDoubleClick={(e) => {
          onDoubleClickHandler(e);
        }}
      >
        {props.children}
      </Stack>
    </>
  );
}
