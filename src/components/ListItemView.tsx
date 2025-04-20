import { useCallback, useState } from "react";
import ItemView from "./ItemView.tsx";
import { itemViewProps, tagType } from "../types/types.ts";
import SearchBar from "./SearchBar.tsx";
export default function ListItemView(args: {
  books: itemViewProps[];
  tags: tagType[];
  setSearchInput: (arg0: string) => void;
}) {
  const [showFullname, setshowFullname] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const addToSelected = useCallback((item: string) => {
    setSelectedItems((prev) => (prev.includes(item) ? prev : [...prev, item]));
  }, []);

  const clearSelected = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const removeFromSelected = useCallback((item: string) => {
    setSelectedItems((prev) => prev.filter((si) => si !== item));
  }, []);
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
