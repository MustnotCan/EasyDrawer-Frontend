import { useState } from "react";
import ItemView from "./ItemView.tsx";
import { itemViewProps, tagType } from "../types/types.ts";
import SearchBar from "./SearchBar.tsx";
export default function ListItemView(args: {
  books: itemViewProps[];
  tags: tagType[];
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [showFullname, setshowFullname] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const addToSelected = (item: string) => {
    if (selectedItems.includes(item)) {
      return;
    }
    setSelectedItems((previousItems) => [...previousItems, item]);
  };
  const clearSelected = () => setSelectedItems(() => []);
  const removeFromSelected = (item: string) => {
    setSelectedItems((previousItems) => [
      ...previousItems.filter((si) => si != item),
    ]);
  };
  return (
    <>
      <div>
        Selected:{selectedItems.length}
        <button onClick={clearSelected}>clear Selected</button>
      </div>
      <div>
        <button
          onClick={() => {
            setshowFullname(!showFullname);
          }}
        >
          {showFullname == true ? "Hide" : "Show"} full name
        </button>
      </div>
      <div>
        <SearchBar setSearchInput={args.setSearchInput} />
        <div className="divPdfs">
          {args.books.map((IV: itemViewProps) => {
            const selected = selectedItems.includes(IV.title);
            return (
              <div key={IV.path}>
                {selected ? (
                  <button onClick={() => removeFromSelected(IV.title)}>
                    Unselect
                  </button>
                ) : (
                  <></>
                )}
                <ItemView
                  addToSelected={addToSelected}
                  removeFromSelected={removeFromSelected}
                  itemView={{
                    prop: IV,
                    showFullName: showFullname,
                    existingTags: args.tags,
                    itemTags: IV.tags,
                  }}
                  selected={selected}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
