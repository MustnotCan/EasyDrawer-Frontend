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

  return (
    <>
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
            return (
              <ItemView
                key={IV.path}
                prop={IV}
                showFullName={showFullname}
                existingTags={args.tags}
                itemTags={IV.tags}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
