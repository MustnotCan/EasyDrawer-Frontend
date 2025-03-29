import { useState } from "react";
import ItemView, { itemViewProps } from "./CC/CC1/ItemView.tsx";
import { FileType } from "../../../types/pdfFile.ts";
import { tagType } from "../../../utils/queries/tagsApi.ts";
import SearchBar from "./CC/CC2/SearchBar.tsx";

export default function ListItemView(args: {
  books: FileType[];
  tags: tagType[];
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
        <SearchBar />
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
