import { bookmarkWithIdType } from "../../types/types";

export function getLastAddedItem(bookmarks: bookmarkWithIdType[]) {
  let hasNoSib: string | null = null;
  if (bookmarks.length > 0) {
    const preSibId = bookmarks[0];
    hasNoSib = preSibId.id ?? null;
    while (hasNoSib != null) {
      const posHasNoSib = bookmarks.find((bk) => bk.preSibId == hasNoSib)?.id;
      if (posHasNoSib == null) {
        break;
      }
      hasNoSib = posHasNoSib;
    }
  }
  return hasNoSib;
}
// drag an item to a parent
export function drag(
  bookmarks: bookmarkWithIdType[],
  draggedId: string,
  draggedToId: string
): {
  newActive: bookmarkWithIdType | null;
  newOldNext: bookmarkWithIdType | null;
} {
  const targetId = draggedToId;
  const activeId = draggedId;
  if (activeId == targetId) return { newActive: null, newOldNext: null };
  const activeItemIndex = bookmarks.findIndex((bk) => bk.id == activeId);
  const activeItem = bookmarks[activeItemIndex];
  if ((activeItem.parentId ?? "root") === targetId) {
    return { newActive: null, newOldNext: null };
  }

  let newActiveItem: bookmarkWithIdType;
  if (targetId === "root") {
    newActiveItem = {
      ...activeItem,
      parentId: null,
      preSibId: getLastAddedItem(bookmarks.filter((bk) => bk.parentId == null)),
    };
  } else {
    const activeItem = bookmarks[activeItemIndex];
    newActiveItem = {
      ...activeItem,
      parentId: targetId,
      preSibId: getLastAddedItem(
        bookmarks.filter((bk) => bk.parentId == targetId)
      ),
    };
  }
  const oldNext = bookmarks.find((bk) => bk.preSibId == activeId);
  let newOldNext: bookmarkWithIdType | null = null;
  if (oldNext) {
    newOldNext = { ...oldNext, preSibId: activeItem.preSibId };
  }
  return { newActive: newActiveItem, newOldNext: newOldNext };
}

export function reorder(
  bookmarks: bookmarkWithIdType[],
  draggedId: string,
  draggedToId: string
): {
  newDragged: bookmarkWithIdType | null;
  newDraggedTo: bookmarkWithIdType | null;
  newActiveNext: bookmarkWithIdType | null;
} {
  const NOOP = { newDragged: null, newDraggedTo: null, newActiveNext: null };
  if (draggedId === draggedToId) return NOOP;
  let dragged: bookmarkWithIdType | undefined;
  let draggedTo: bookmarkWithIdType | undefined;
  let draggedNext: bookmarkWithIdType | undefined;
  for (const bk of bookmarks) {
    if (bk.id === draggedId) dragged = bk;
    else if (bk.id === draggedToId) draggedTo = bk;
    else if (bk.preSibId === draggedId) draggedNext = bk;
  }
  if (!dragged || !draggedTo) return NOOP;
  if (dragged.parentId !== draggedTo.parentId) {
    return NOOP;
  }
  if (dragged.id === draggedTo.preSibId) return NOOP;
  const newActiveNext = draggedNext
    ? { ...draggedNext, preSibId: dragged.preSibId }
    : null;

  const newDragged: bookmarkWithIdType = {
    ...dragged,
    preSibId: draggedTo.preSibId,
  };

  const newDraggedTo: bookmarkWithIdType = {
    ...draggedTo,
    preSibId: dragged.id ?? null,
  };

  return { newDragged, newDraggedTo, newActiveNext };
}

export function dragAndReorder(
  bookmarks: bookmarkWithIdType[],
  draggedId: string,
  draggedToId: string
): {
  newOldNext: bookmarkWithIdType | null;
  newDraggedTo: bookmarkWithIdType | null;
  newActiveNext: bookmarkWithIdType | null;
  newDragged: bookmarkWithIdType | null;
} {
  const clone = [...bookmarks];
  const draggedParent = clone.find((bk) => bk.id == draggedId)?.parentId;
  const draggedToParent = clone.find((bk) => bk.id == draggedToId)?.parentId;
  if (draggedParent != draggedToParent) {
    const { newActive, newOldNext } = drag(
      clone,
      draggedId,
      draggedToParent || "root"
    );
    const draggedIndex = clone.findIndex((bk) => bk.id == draggedId);
    const oldIndex = clone.findIndex((bk) => bk.id == newOldNext?.id);
    if (newActive && draggedIndex !== -1) {
      clone[draggedIndex] = newActive;
    }

    if (newOldNext && oldIndex !== -1) {
      clone[oldIndex] = newOldNext;
    }
    const { newActiveNext, newDragged, newDraggedTo } = reorder(
      clone,
      draggedId,
      draggedToId
    );
    return { newOldNext, newActiveNext, newDraggedTo, newDragged };
  } else {

    const { newActiveNext, newDragged, newDraggedTo } = reorder(
      bookmarks,
      draggedId,
      draggedToId
    );

    return {
      newActiveNext,
      newDragged,
      newDraggedTo,
      newOldNext: null,
    };
  }
}
