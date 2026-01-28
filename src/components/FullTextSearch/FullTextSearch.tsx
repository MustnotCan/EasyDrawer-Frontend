import { search } from "../../utils/queries/meiliSearchApi";
import { useQuery } from "@tanstack/react-query";
import ListItemView from "../ListItemView";
import { useState } from "react";
import { Alert, Box, Button, Stack } from "@chakra-ui/react";
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
        <Box
          display={
            indexes.data?.length && indexes.data?.length > 0 ? "block" : "none"
          }
        >
          <TagFilter
            isFavorite={false}
            setTFB={alteredSetTFB}
            tags={indexes.data || []}
            deleteTagMutation={deleteIndexMutation}
            renameTagMutation={undefined}
            filterKey="indexes"
          />
        </Box>

        {!indexes.data?.length && (
          <Alert.Root status={"error"} width={"10rem"} height={"8rem"}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>No index</Alert.Title>
              <br />
              Please Create an index
            </Alert.Content>
          </Alert.Root>
        )}
        <TagAdder mutate={addIndexMutation} filterKey="Index" />
      </Stack>
      {selectedIndexes.length == 0 ? (
        <Alert.Root status={"error"} width={"15rem"} height={"8rem"}>
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
            <Alert.Root status={"info"} width={"15rem"} height={"8rem"}>
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
