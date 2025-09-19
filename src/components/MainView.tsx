import ListItemView from "./ListItemView";
import TagFilter from "./TagFilter/TagFilter";
import Paginator from "./Paginator";
import AddTag from "./TagAdder";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getBooks } from "../utils/queries/booksApi";
import { getTags } from "../utils/queries/tagsApi";
import { useLocation } from "react-router-dom";
import { Stack } from "@chakra-ui/react";
import MainViewSwitch from "./MainViewSwitch";
import { orderByType } from "@/types/types";
export default function View() {
  const [pn, setPn] = useState(1);
  const [take, setTake] = useState(25);
  const [tagsFilterBy, setTFB] = useState<string[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  const [isAnd, setIsAnd] = useState<boolean>(true);
  const [orderBy, setOrderBy] = useState<orderByType>({
    direction: "desc",
    criteria: "lastAccess",
  });
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
        setTFB(["favorite"]);
        setPn(1);
        break;
      case "/unclassified":
        setTFB(["unclassified"]);
        setPn(1);

        break;
      case "/browse":
        setTFB([]);
        setPn(1);

        break;
    }
  }, [location]);

  const { data } = useQuery({
    queryKey: [
      "books",
      pn,
      take,
      [...tagsFilterBy].sort().join(","),
      searchName,
      isAnd,
      orderBy,
    ],
    queryFn: ({ queryKey }) => {
      const res = getBooks({
        spp: queryKey[1] as number,
        spt: queryKey[2] as number,
        tfb: queryKey[3] as unknown as string[],
        searchName: queryKey[4] as string,
        isAnd: queryKey[5] as boolean,
        orderBy: queryKey[6] as orderByType,
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
          <MainViewSwitch isAnd={isAnd} setIsAnd={setIsAnd} />

          <AddTag />
        </Stack>
      )}
      <Stack>
        <ListItemView
          books={data?.data || []}
          setSearchInput={alteredSetSearchName}
          setTake={alteredSetTake}
          queryData={[
            pn,
            take,
            [...tagsFilterBy].sort().join(","),
            searchName,
            isAnd,
            orderBy,
          ]}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
        />
        {data?.data.length != 0 && (
          <Paginator pn={pn} setPn={setPn} count={data?.count || 1} />
        )}
      </Stack>
    </Stack>
  );
}
