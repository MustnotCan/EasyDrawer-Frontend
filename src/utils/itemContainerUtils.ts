import { selectedItem } from "@/types/types";

export const addToSelected = (
  item: selectedItem,
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItem[]>>
) => {
  setSelectedItems((prev) => (prev.includes(item) ? prev : [...prev, item]));
};

export const clearSelected = (
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItem[]>>
) => {
  setSelectedItems([]);
};

export const removeFromSelected = (
  item: selectedItem,
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItem[]>>
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
  item: selectedItem,
  selectedItems: selectedItem[],
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItem[]>>
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
