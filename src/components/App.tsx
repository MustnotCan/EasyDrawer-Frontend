import ListItemView from "./ListItemView";
import ItemSize from "./ItemSize";
import TagFilter from "./TagFilter";
import Paginator from "./Paginator";
import AddTag from "./AddTag";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getBooks } from "../utils/queries/booksApi";
import { getTags } from "../utils/queries/tagsApi";
export default function View() {
  const [pn, setPn] = useState(1);
  const [take, setTake] = useState(10);
  const [tagsFilterBy, setTFB] = useState<string[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  const books = useQuery({
    queryKey: [
      "books",
      pn,
      take,
      [...tagsFilterBy].sort().join(","),
      searchName,
    ],
    queryFn: ({ queryKey }) => {
      return getBooks({
        spp: queryKey[1] as number,
        spt: queryKey[2] as number,
        tfb: tagsFilterBy,
        searchName: queryKey[4] as string,
      });
    },
  });
  const tags = useQuery({ queryKey: ["tags"], queryFn: getTags });

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <TagFilter tags={tags.data || []} setTFB={setTFB} />
      <AddTag />
      <div style={{ flex: 1 }}>
        <ItemSize setTake={setTake} />
        <ListItemView
          books={books.data?.data || []}
          tags={tags.data || []}
          setSearchInput={setSearchName}
        />
        <Paginator setPn={setPn} count={books.data?.count || 0} />
      </div>
    </div>
  );
}
