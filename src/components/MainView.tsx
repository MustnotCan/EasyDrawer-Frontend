import ListItemView from "./ListItemView";
import TagFilter from "./TagFilter/TagFilter";
import Paginator from "./Paginator";
import AddTag from "./AddTag";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getBooks } from "../utils/queries/booksApi";
import { getTags } from "../utils/queries/tagsApi";
import { useLocation } from "react-router-dom";
import { Stack } from "@chakra-ui/react";
export default function View() {
  const [pn, setPn] = useState(1);
  const [take, setTake] = useState(25);
  const [tagsFilterBy, setTFB] = useState<string[]>([]);
  const [searchName, setSearchName] = useState<string>("");
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
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pn]);
  useEffect(() => {
    switch (location.pathname) {
      case "/favorite":
        setTFB(["Favorite"]);
        setPn(1);
        break;
      case "/unclassified":
        setTFB(["Unclassified"]);
        setPn(1);

        break;
      case "/browse":
        setTFB([]);
        setPn(1);

        break;
    }
  }, [location]);

  const books = useQuery({
    queryKey: [
      "books",
      pn,
      take,
      [...tagsFilterBy].sort().join(","),
      searchName,
    ],
    queryFn: ({ queryKey }) => {
      const res = getBooks({
        spp: queryKey[1] as number,
        spt: queryKey[2] as number,
        tfb: queryKey[3] as unknown as string[],
        searchName: queryKey[4] as string,
      });
      return res;
    },
  });

  const tags = useQuery({ queryKey: ["tags"], queryFn: getTags });

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
    <Stack direction={"row"}>
      {!(location.pathname == "/unclassified") && (
        <Stack marginRight={"10"}>
          <TagFilter
            tags={tags.data || []}
            setTFB={alteredSetTFB}
            isFavorite={location.pathname == "/favorite"}
          />
          <AddTag />
        </Stack>
      )}
      <Stack>
        <ListItemView
          books={books.data?.data || []}
          setSearchInput={alteredSetSearchName}
          setTake={alteredSetTake}
          queryData={[pn, take, [...tagsFilterBy].sort().join(","), searchName]}
        />
        {books.data?.data.length != 0 && (
          <Paginator pn={pn} setPn={setPn} count={books.data?.count || 1} />
        )}
      </Stack>
    </Stack>
  );
}
