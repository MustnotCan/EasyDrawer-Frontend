import { search } from "../../utils/queries/meiliSearchApi";
import { useQuery } from "@tanstack/react-query";
import ListItemView from "../ListItemView";
import { useState } from "react";
import { Alert, Button, Stack } from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import TagFilter from "../TagFilter/TagFilter";
import {
  useAddIndex,
  useDeleteIndex,
  useIndexes,
} from "../../utils/Hooks/IndexHook";
import TagAdder from "../TagAdder";
import { hitResultsType } from "@/types/types";

export default function FullTextSearch() {
  const [take, setTake] = useState(50);
  const [searchName, setSearchName] = useState<string>("");
  const [offset, setOffset] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState<string[]>([]);
  const alteredSetSearchName = (newSearchName: string) => {
    if (newSearchName != searchName) {
      setSearchName(newSearchName);
    }
    setOffset(0);
  };
  const data = useQuery({
    queryKey: ["fts", selectedIndexes, offset, take, searchName],
    queryFn: () =>
      search({
        selectedIndexes: selectedIndexes,
        query: searchName,
        hitsPerPage: take,
        offset: offset,
      }),
  });

  const alteredSetTFB = (newTfb: string[]) => {
    const setA = new Set(newTfb);
    const setB = new Set(selectedIndexes);

    const noDiff =
      setA.size === setB.size && [...setA].every((tag) => setB.has(tag));

    if (!noDiff) {
      setSelectedIndexes(newTfb);
      alteredSetSearchName("");
    }
  };
  const indexes = useIndexes();
  const addIndexMutation = useAddIndex();
  const deleteIndexMutation = useDeleteIndex();
  const estimatedTotalHits = data.data?.estimatedTotalHits || 0;
  const foundResults: hitResultsType[] | undefined = data.data
    ? data.data.data
    : [];
  return (
    <Stack direction={"row"}>
      <Stack direction={"column"}>
        <TagFilter
          isFavorite={false}
          setTFB={alteredSetTFB}
          tags={indexes.data || []}
          deleteTagMutation={deleteIndexMutation}
          renameTagMutation={undefined}
          filterKey="indexes"
        />
        <TagAdder mutate={addIndexMutation} filterKey="Index" />
      </Stack>
      {selectedIndexes.length == 0 ? (
        <Alert.Root status={"error"} maxH={"8vh"} justifySelf={"center"}>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>No chosen index</Alert.Title>
            <br />
            Please Select at least an index before searching
          </Alert.Content>
        </Alert.Root>
      ) : (
        <Stack>
          <ListItemView
            books={foundResults}
            setTake={setTake}
            setSearchInput={alteredSetSearchName}
            queryData={[offset, take, undefined, searchName]}
            isForFTS={true}
          />
          {searchName && foundResults.length == 0 && <p> No result found</p>}
          {!searchName && (
            <Alert.Root status={"info"} maxW={"fit-content"} maxH={"8vh"}>
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Search input is empty</Alert.Title>
                <br />
                Please search for something
              </Alert.Content>
            </Alert.Root>
          )}
          {estimatedTotalHits > 0 && searchName && (
            <Stack direction="row" placeContent={"center"}>
              <Button
                disabled={offset == 0}
                onClick={() => setOffset((prev) => prev - 1)}
              >
                <FaArrowLeft />
              </Button>
              <Button
                disabled={offset * take + take >= estimatedTotalHits}
                onClick={() => setOffset((prev) => prev + 1)}
              >
                <FaArrowRight />
              </Button>
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  );
}
