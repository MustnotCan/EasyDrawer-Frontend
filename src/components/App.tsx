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
  const alteredSetTFB = (newTfb: string[]) => {
    const setA = new Set(newTfb);
    const setB = new Set(tagsFilterBy);

    const noDiff =
      setA.size === setB.size && [...setA].every((tag) => setB.has(tag));

    if (!noDiff) {
      setTFB(newTfb);
      setPn(1);
    }
  };
  const alteredSetTake = (newTake: number) => {
    if (newTake != take) {
      setTake(newTake);
      setPn(1);
    }
  };
  const alteredSetSearchName = (newSearchName: string) => {
    if (newSearchName != searchName) {
      setSearchName(newSearchName);
      setPn(1);
    }
  };
  return (
    <div className="MainView">
      <div>
        <TagFilter tags={tags.data || []} setTFB={alteredSetTFB} />
        <AddTag />
      </div>
      <div className="booksView">
        <ItemSize setTake={alteredSetTake} />
        <ListItemView
          books={books.data?.data || []}
          tags={tags.data || []}
          setSearchInput={alteredSetSearchName}
        />
        {books.data?.data.length != 0 && (
          <Paginator pn={pn} setPn={setPn} count={books.data?.count || 0} />
        )}
      </div>
    </div>
  );
}
