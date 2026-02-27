import { Stack } from "@chakra-ui/react";
import {
  itemViewType,
  multiTaggerFilePropsType,
  multiTaggerFolderPropsType,
  selectedItemType,
} from "../../types/types.ts";
import {
  isItemView,
  isMultiTaggerFileProps,
  isMultiTaggerFolderProps,
} from "../../utils/guards.ts";
import { toggleSelected } from "../../utils/itemContainerUtils.ts";
import { Dispatch, SetStateAction, useRef } from "react";

type PathSetsByType = {
  file: Set<string>;
  folder: Set<string>;
};

const pathSetsCache = new WeakMap<selectedItemType[], PathSetsByType>();

const getCachedPathSets = (items: selectedItemType[]) => {
  const cached = pathSetsCache.get(items);
  if (cached) return cached;

  const next: PathSetsByType = {
    file: new Set<string>(),
    folder: new Set<string>(),
  };
  for (const item of items) {
    if (item.type === "file") next.file.add(item.path);
    else next.folder.add(item.path);
  }
  pathSetsCache.set(items, next);
  return next;
};

export function ItemContainer(props: {
  children: React.ReactElement<
    itemViewType | multiTaggerFilePropsType | multiTaggerFolderPropsType
  >;
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItemType[]>>;
  selectedItems: selectedItemType[];
  selectedItemsRef?: React.MutableRefObject<selectedItemType[]>;
  unSelectedItems: selectedItemType[];
  unSelectedItemsRef?: React.MutableRefObject<selectedItemType[]>;
  setUnSelectedItems: React.Dispatch<React.SetStateAction<selectedItemType[]>>;
  forceSelected?: boolean;
  multiSelectActive?: boolean;
}) {
  const longPressTimer = useRef<number | null>(null);
  const singleTapTimer = useRef<number | null>(null);
  const longPressTriggered = useRef(false);
  const touchInteractionPending = useRef(false);
  const ignoreNextNativeDoubleClick = useRef(false);
  const lastTouchTapAt = useRef(0);
  const LONG_PRESS_MS = 500;
  const DOUBLE_TAP_MS = 350;

  const getPathAncestors = (path: string) => {
    const parts = path.split("/");
    const ancestors: string[] = [];
    let current = "";
    for (let i = 0; i < parts.length; i++) {
      current = i === 0 ? parts[i] : current + "/" + parts[i];
      ancestors.push(current);
    }
    return ancestors;
  };

  const getLastMatchingPath = (
    ancestors: string[],
    set: Set<string>,
    exclude?: string,
  ) => {
    let last = "";
    for (const ancestor of ancestors) {
      if (ancestor !== exclude && set.has(ancestor)) last = ancestor;
    }
    return last;
  };

  const clearLongPressTimer = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const clearSingleTapTimer = () => {
    if (singleTapTimer.current) {
      window.clearTimeout(singleTapTimer.current);
      singleTapTimer.current = null;
    }
  };

  const stopPrefixMatches = (targetPath: string, itemPath: string) =>
    itemPath.startsWith(targetPath);

  const hasCtrlLikeModifier = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => e.ctrlKey || e.metaKey;

  const resetTouchInteraction = () => {
    touchInteractionPending.current = false;
    lastTouchTapAt.current = 0;
    clearSingleTapTimer();
    clearLongPressTimer();
  };

  let selected = false;
  let selectLikeDesktopCtrlClick: () => void = () => {};
  let onDoubleClickHandler: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void = () => {};
  let mobileTouchClickHandler: (() => void) | null = null;
  const selectedItems = props.selectedItemsRef?.current ?? props.selectedItems;
  const unSelectedItems =
    props.unSelectedItemsRef?.current ?? props.unSelectedItems;

  if (isItemView(props.children)) {
    const prop = props.children.props.itemView.prop;
    const type = "file";
    const filePath = prop.path + "/" + prop.title;
    const selectedFileSet = getCachedPathSets(selectedItems).file;
    selected = props.forceSelected ?? selectedFileSet.has(filePath);
    selectLikeDesktopCtrlClick = () => {
      toggleSelected(
        { path: filePath, type: type },
        selectedItems,
        props.setSelectedItems,
      );
    };
    onDoubleClickHandler = (e) => {
      if (!hasCtrlLikeModifier(e)) {
        const encodedUri = encodeURIComponent(prop.id);
        const newWindow = window.open(
          "http://" + location.host + `/pdfreader/${encodedUri}`,
          "_blank",
        );
        if (newWindow) newWindow.localStorage.setItem(prop.id, prop.title);
      }
    };
    mobileTouchClickHandler = () => {
      window.dispatchEvent(
        new CustomEvent("item-view-mobile-actions-open", {
          detail: { id: prop.id },
        }),
      );
    };
  } else if (isMultiTaggerFileProps(props.children)) {
    const selectedPathSets = getCachedPathSets(selectedItems);
    const unselectedPathSets = getCachedPathSets(unSelectedItems);
    const selectedFileSet = selectedPathSets.file;
    const selectedFolderSet = selectedPathSets.folder;
    const unselectedFileSet = unselectedPathSets.file;
    const unselectedFolderSet = unselectedPathSets.folder;
    const item = props.children.props.item;
    const fullPath = item.path + "/" + item.title;
    const alreadyInUSI = unselectedFileSet.has(fullPath);
    const alreadyInSI = selectedFileSet.has(fullPath);
    const ancestors = getPathAncestors(fullPath);
    const lsp = getLastMatchingPath(ancestors, selectedFolderSet);
    const lup = getLastMatchingPath(ancestors, unselectedFolderSet);
    const haveSelectedParent = lsp.length > 0;

    selected =
      alreadyInSI ||
      (lsp.length - lup.length > 0 && !alreadyInUSI) ||
      (lsp.length - lup.length < 0 && alreadyInSI);
    const toggle = (
      selectedItems: selectedItemType[],
      setSelectedItems: Dispatch<SetStateAction<selectedItemType[]>>,
    ) =>
      toggleSelected(
        {
          path: fullPath,
          type: "file",
        },
        selectedItems,
        setSelectedItems,
      );
    selectLikeDesktopCtrlClick = () => {
      if (!haveSelectedParent) {
        toggle(selectedItems, props.setSelectedItems);
      } else {
        if (lsp.length - lup.length > 0) {
          toggle(unSelectedItems, props.setUnSelectedItems);
        } else {
          toggle(selectedItems, props.setSelectedItems);
        }
      }
    };
    onDoubleClickHandler = (e) => {
      if (!hasCtrlLikeModifier(e)) {
        const encodedUri = encodeURIComponent(item.id);
        window.open(
          "http://" + location.host + `/pdfreader/${encodedUri}`,
          "_blank",
        );
      }
    };
  } else if (isMultiTaggerFolderProps(props.children)) {
    const selectedPathSets = getCachedPathSets(selectedItems);
    const unselectedPathSets = getCachedPathSets(unSelectedItems);
    const selectedFolderSet = selectedPathSets.folder;
    const unselectedFolderSet = unselectedPathSets.folder;
    const path = props.children.props.path;
    const item = props.children.props.item;
    const ancestors = getPathAncestors(path);
    const setDir = props.children.props.setDir;

    const alreadyInSI = selectedFolderSet.has(path);
    const alreadyInUSI = unselectedFolderSet.has(path);
    const lsp = getLastMatchingPath(ancestors, selectedFolderSet, path);
    const lup = getLastMatchingPath(ancestors, unselectedFolderSet, path);
    const haveSelectedParent = lsp.length > 0;
    selected =
      alreadyInSI ||
      (lsp.length - lup.length > 0 && !alreadyInUSI) ||
      (lsp.length - lup.length < 0 && alreadyInSI);
    const freeUSI = () => {
      props.setUnSelectedItems((prev) => {
        return prev.filter((ui) => !stopPrefixMatches(path, ui.path));
      });
    };
    const freeSI = () => {
      props.setSelectedItems((prev) => {
        return prev.filter((si) => !stopPrefixMatches(path, si.path));
      });
    };
    const toggle = (
      selectedItems: selectedItemType[],
      setSelectedItems: Dispatch<SetStateAction<selectedItemType[]>>,
    ) =>
      toggleSelected(
        {
          path: path,
          type: "folder",
        },
        selectedItems,
        setSelectedItems,
      );
    selectLikeDesktopCtrlClick = () => {
      if (!haveSelectedParent) {
        freeSI();
        if (alreadyInSI) {
          freeUSI();
        }
        toggle(selectedItems, props.setSelectedItems);
      } else {
        if (lsp.length - lup.length > 0) {
          freeUSI();
          if (alreadyInUSI) {
            freeSI();
          }
          toggle(unSelectedItems, props.setUnSelectedItems);
        } else {
          freeSI();
          if (alreadyInSI) {
            freeUSI();
          }
          toggle(selectedItems, props.setSelectedItems);
        }
      }
    };
    onDoubleClickHandler = (e) => {
      if (!hasCtrlLikeModifier(e)) {
        setDir((dirs) => [...dirs, item]);
      }
    };
  }
  return (
    <Stack
      className={"hover:cursor-pointer " + (selected ? " opacity-50" : "")}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      onDragStart={(e) => {
        e.preventDefault();
      }}
      css={{
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
      onClick={(e) => {
        const isTouchClick = touchInteractionPending.current;
        touchInteractionPending.current = false;

        if (longPressTriggered.current) {
          longPressTriggered.current = false;
          e.preventDefault();
          return;
        }
        const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
        const multiSelectEnabled =
          props.multiSelectActive ?? selectedItems.length >= 1;

        if (
          isTouchClick &&
          isCoarsePointer &&
          mobileTouchClickHandler &&
          !multiSelectEnabled
        ) {
          const now = Date.now();
          const isDoubleTap = now - lastTouchTapAt.current <= DOUBLE_TAP_MS;

          if (isDoubleTap) {
            clearSingleTapTimer();
            lastTouchTapAt.current = 0;
            ignoreNextNativeDoubleClick.current = true;
            onDoubleClickHandler(e);
            return;
          }

          lastTouchTapAt.current = now;
          clearSingleTapTimer();
          singleTapTimer.current = window.setTimeout(() => {
            mobileTouchClickHandler();
            singleTapTimer.current = null;
            lastTouchTapAt.current = 0;
          }, DOUBLE_TAP_MS);
          return;
        }

        if (hasCtrlLikeModifier(e) || (multiSelectEnabled && isTouchClick)) {
          selectLikeDesktopCtrlClick();
          return;
        }
      }}
      onTouchStart={() => {
        touchInteractionPending.current = true;
        longPressTriggered.current = false;
        clearSingleTapTimer();
        clearLongPressTimer();
        longPressTimer.current = window.setTimeout(() => {
          longPressTriggered.current = true;
          lastTouchTapAt.current = 0;
          clearSingleTapTimer();
          selectLikeDesktopCtrlClick();
          longPressTimer.current = null;
        }, LONG_PRESS_MS);
      }}
      onTouchEnd={() => {
        clearLongPressTimer();
      }}
      onTouchCancel={() => {
        resetTouchInteraction();
      }}
      onTouchMove={() => {
        resetTouchInteraction();
      }}
      onDoubleClick={(e) => {
        if (ignoreNextNativeDoubleClick.current) {
          ignoreNextNativeDoubleClick.current = false;
          return;
        }
        onDoubleClickHandler(e);
      }}
    >
      {props.children}
    </Stack>
  );
}
