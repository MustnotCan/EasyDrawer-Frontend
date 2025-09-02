import { selectedItemType } from "@/types/types";

export const addToSelected = (
  item: selectedItemType,
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItemType[]>>
) => {
  setSelectedItems((prev) => (prev.includes(item) ? prev : [...prev, item]));
};

export const clearSelected = (
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItemType[]>>
) => {
  setSelectedItems([]);
};

export const removeFromSelected = (
  item: selectedItemType,
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItemType[]>>
) => {
  setSelectedItems((prev) => {
    const newList = prev.filter(
      (si) =>
        (si.path !== item.path && si.type == item.type) || si.type !== item.type
    );

    return newList;
  });
};
export const toggleSelected = (
  item: selectedItemType,
  selectedItems: selectedItemType[],
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItemType[]>>
) => {
  if (
    selectedItems
      .filter((i) => i.type == item.type)
      .map((item) => item.path)
      .includes(item.path)
  ) {
    removeFromSelected(item, setSelectedItems);
  } else {
    addToSelected(item, setSelectedItems);
  }
};
