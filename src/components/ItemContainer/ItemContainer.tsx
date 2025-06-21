import { Stack } from "@chakra-ui/react";
import {
  itemView,
  multiTaggerFileProps,
  multiTaggerFolderProps,
  selectedItem,
} from "../../types/types.ts";
import {
  isItemView,
  isMultiTaggerFileProps,
  isMultiTaggerFolderProps,
} from "../../utils/guards.ts";
import { toggleSelected } from "../../utils/itemContainerUtils.ts";
import { Dispatch, SetStateAction, useMemo } from "react";

export function ItemContainer(props: {
  children: React.ReactElement<
    itemView | multiTaggerFileProps | multiTaggerFolderProps
  >;
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItem[]>>;
  selectedItems: selectedItem[];
  unSelectedItems: selectedItem[];
  setUnSelectedItems: React.Dispatch<React.SetStateAction<selectedItem[]>>;
}) {
  const filteredSIFiles = useMemo(
    () =>
      props.selectedItems.filter((i) => i.type === "file").map((i) => i.path),
    [props.selectedItems]
  );
  const filteredSIFolders = useMemo(
    () =>
      props.selectedItems.filter((i) => i.type === "folder").map((i) => i.path),
    [props.selectedItems]
  );

  const filteredUSIFolders = useMemo(
    () =>
      props.unSelectedItems
        .filter((i) => i.type === "folder")
        .map((i) => i.path),
    [props.unSelectedItems]
  );
  const filteredUSIFiles = useMemo(
    () =>
      props.unSelectedItems.filter((i) => i.type === "file").map((i) => i.path),
    [props.unSelectedItems]
  );
  let selected = false;
  let clickHandler: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  let onDoubleClickHandler: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;

  if (isItemView(props.children)) {
    const prop = props.children.props.itemView.prop;
    const type = "file";
    selected = props.selectedItems
      .filter((item) => item.type == type)
      .map((file) => file.path)
      .includes(prop.path + "/" + prop.title);
    clickHandler = (e) => {
      if (e.ctrlKey) {
        toggleSelected(
          { path: prop.path + "/" + prop.title, type: type },
          props.selectedItems,
          props.setSelectedItems
        );
      }
    };
    onDoubleClickHandler = (e) => {
      if (!e.ctrlKey) {
        const encodedUri = encodeURIComponent(prop.path + "/" + prop.title);
        window.open(
          "http://" + location.host + `/pdfreader/${encodedUri}`,
          "_blank"
        );
      }
    };
  } else if (isMultiTaggerFileProps(props.children)) {
    const item = props.children.props.item;
    const path = item.path;

    const alreadyInUSI = filteredUSIFiles.includes(path + "/" + item.title);
    const alreadyInSI = filteredSIFiles.includes(path + "/" + item.title);

    const splittedPath = (path + "/" + item.title)
      .split("/")
      .map((p, index, array) =>
        index == 0 ? p : [...array.slice(0, index), p].join("/")
      );
    const selectedParents = splittedPath.filter((v) =>
      filteredSIFolders.includes(v)
    );
    const unSelectedParents = splittedPath.filter((v) =>
      filteredUSIFolders.includes(v)
    );
    const haveSelectedParent = selectedParents.length > 0;
    const lsp = selectedParents.at(selectedParents.length - 1) || "";
    const lup = unSelectedParents.at(unSelectedParents.length - 1) || "";

    selected =
      alreadyInSI ||
      (lsp.length - lup.length > 0 && !alreadyInUSI) ||
      (lsp.length - lup.length < 0 && alreadyInSI);
    const toggle = (
      selectedItems: selectedItem[],
      setSelectedItems: Dispatch<SetStateAction<selectedItem[]>>
    ) =>
      toggleSelected(
        {
          path: item.path + "/" + item.title,
          type: "file",
        },
        selectedItems,
        setSelectedItems
      );
    clickHandler = (e) => {
      if (e.ctrlKey) {
        if (!haveSelectedParent) {
          toggle(props.selectedItems, props.setSelectedItems);
        } else if (haveSelectedParent) {
          if (lsp.length - lup.length > 0) {
            toggle(props.unSelectedItems, props.setUnSelectedItems);
          } else {
            toggle(props.selectedItems, props.setSelectedItems);
          }
        }
      }
    };
    onDoubleClickHandler = (e) => {
      if (!e.ctrlKey) {
        const encodedUri = encodeURIComponent(item.path + "/" + item.title);
        window.open(
          "http://" + location.host + `/pdfreader/${encodedUri}`,
          "_blank"
        );
      }
    };
  } else if (isMultiTaggerFolderProps(props.children)) {
    // what if we select parent deselect an element and then deselect parent ? the deselected element will still be there
    //need queries for sending selected+unselected in queries
    //should use a boutton that triggers the menu that do the fetching and then change tags
    const path = props.children.props.path;
    const item = props.children.props.item;
    const splittedPath = path
      .split("/")
      .map((p, index, array) =>
        index == 0 ? p : [...array.slice(0, index), p].join("/")
      );
    const setDir = props.children.props.setDir;

    const alreadyInSI = filteredSIFolders.includes(path);
    const alreadyInUSI = filteredUSIFolders.includes(path);
    const selectedParents = splittedPath.filter(
      (v) => filteredSIFolders.includes(v) && v != path
    );
    const unSelectedParents = splittedPath.filter(
      (v) => filteredUSIFolders.includes(v) && v != path
    );
    const haveSelectedParent = selectedParents.length > 0;
    const lsp = selectedParents.at(selectedParents.length - 1) || "";
    const lup = unSelectedParents.at(unSelectedParents.length - 1) || "";
    selected =
      alreadyInSI ||
      (lsp.length - lup.length > 0 && !alreadyInUSI) ||
      (lsp.length - lup.length < 0 && alreadyInSI);
    const freeUSI = () => {
      if (props.setUnSelectedItems) {
        props.setUnSelectedItems((prev) => {
          return prev.filter(
            (ui) =>
              !(ui.path.slice(0, path.length) == path.slice(0, path.length))
          );
        });
      }
    };
    const freeSI = () => {
      props.setSelectedItems((prev) => {
        return prev.filter(
          (si) => !(si.path.slice(0, path.length) == path.slice(0, path.length))
        );
      });
    };
    const toggle = (
      selectedItems: selectedItem[],
      setSelectedItems: Dispatch<SetStateAction<selectedItem[]>>
    ) =>
      toggleSelected(
        {
          path: path,
          type: "folder",
        },
        selectedItems,
        setSelectedItems
      );
    clickHandler = (e) => {
      if (e.ctrlKey) {
        if (!haveSelectedParent) {
          //free SI
          freeSI();
          if (alreadyInSI) {
            //free USI
            freeUSI();
          }
          toggle(props.selectedItems, props.setSelectedItems);
        } else {
          if (lsp.length - lup.length > 0) {
            freeUSI();
            //free USI
            if (alreadyInUSI) {
              //free SI
              freeSI();
            }
            toggle(props.unSelectedItems, props.setUnSelectedItems);
          } else {
            //free SI
            freeSI();
            if (alreadyInSI) {
              //free USI
              freeUSI();
            }
            toggle(props.selectedItems, props.setSelectedItems);
          }
        }
      }
    };
    onDoubleClickHandler = (e) => {
      if (!e.ctrlKey) {
        // what happens if a folder is double clicked ?
        setDir((dirs) => [...dirs, item]);
      }
    };
  }
  return (
    <>
      <Stack
        className={"hover:cursor-pointer " + (selected ? "opacity-50" : "")}
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
