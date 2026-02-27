import { search } from "../../utils/queries/meiliSearchApi";
import { useQuery } from "@tanstack/react-query";
import ListItemView from "../ListItemView";
import { ComponentProps, useEffect, useState } from "react";
import { Alert, Box, Button, Dialog, Portal, Stack } from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import TagFilter from "../TagFilter/TagFilter";
import {
  useAddIndex,
  useDeleteIndex,
  useIndexes,
} from "../../utils/Hooks/IndexHook";
import TagAdder from "../TagAdder";
import { hitResultsType } from "@/types/types";

const TAG_FILTER_CLOSE_DIALOG_EVENT = "tag-filter-close-dialog";

function FullTextSearchFiltersContent(props: {
  indexes: ComponentProps<typeof TagFilter>["tags"];
  setTFB: ComponentProps<typeof TagFilter>["setTFB"];
  selectedValues: ComponentProps<typeof TagFilter>["selectedValues"];
  disableMenuPortal?: ComponentProps<typeof TagFilter>["disableMenuPortal"];
  deleteIndexMutation: ComponentProps<typeof TagFilter>["deleteTagMutation"];
  addIndexMutation: ComponentProps<typeof TagAdder>["mutate"];
}) {
  return (
    <>
      <Box
        display={
          props.indexes?.length && props.indexes.length > 0 ? "block" : "none"
        }
      >
        <TagFilter
          isFavorite={false}
          setTFB={props.setTFB}
          selectedValues={props.selectedValues}
          tags={props.indexes || []}
          disableMenuPortal={props.disableMenuPortal}
          deleteTagMutation={props.deleteIndexMutation}
          renameTagMutation={undefined}
          filterKey="indexes"
        />
      </Box>

      {!props.indexes?.length && (
        <Alert.Root status={"error"} width={"10rem"} height={"8rem"}>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>No index</Alert.Title>
            <br />
            Please Create an index
          </Alert.Content>
        </Alert.Root>
      )}
      <TagAdder mutate={props.addIndexMutation} filterKey="Index" />
    </>
  );
}

export default function FullTextSearch() {
  const [take, setTake] = useState(50);
  const [searchName, setSearchName] = useState<string>("");
  const [offset, setOffset] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState<string[]>([]);
  const [isFiltersDialogOpen, setIsFiltersDialogOpen] = useState(false);
  useEffect(() => {
    const closeDialog = () => setIsFiltersDialogOpen(false);
    window.addEventListener(TAG_FILTER_CLOSE_DIALOG_EVENT, closeDialog);
    return () => {
      window.removeEventListener(TAG_FILTER_CLOSE_DIALOG_EVENT, closeDialog);
    };
  }, []);
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
  const desktopFiltersContent = (
    <FullTextSearchFiltersContent
      indexes={indexes.data || []}
      setTFB={alteredSetTFB}
      selectedValues={selectedIndexes}
      deleteIndexMutation={deleteIndexMutation}
      addIndexMutation={addIndexMutation}
    />
  );

  const dialogFiltersContent = (
    <FullTextSearchFiltersContent
      indexes={indexes.data || []}
      setTFB={alteredSetTFB}
      selectedValues={selectedIndexes}
      disableMenuPortal
      deleteIndexMutation={deleteIndexMutation}
      addIndexMutation={addIndexMutation}
    />
  );
  return (
    <Stack direction={"row"} height={"full"}>
      <Stack marginLeft={"1rem"} display={{ base: "none", lg: "flex" }}>
        {desktopFiltersContent}
      </Stack>
      <Stack height={"full"}>
        <Button
          variant="outline"
          size={{ base: "sm", md: "md" }}
          width={{ base: "full", lg: "auto" }}
          onClick={() => setIsFiltersDialogOpen(true)}
          display={{ base: "block", lg: "none" }}
          marginX={"1rem"}
          marginTop={"1rem"}
        >
          Filters
        </Button>
        {selectedIndexes.length == 0 ? (
          <Stack
            gap={3}
            width="full"
            maxW={{ base: "full", sm: "22rem" }}
            align={{ base: "stretch", lg: "flex-start" }}
            padding={"1rem"}
          >
            <Alert.Root
              status={"error"}
              width={"full"}
              minHeight={"fit"}
              borderRadius="lg"
            >
              <Alert.Indicator />
              <Alert.Content alignItems="center">
                <Alert.Title>No chosen index</Alert.Title>
                <br />
                Please Select at least an index before searching
              </Alert.Content>
            </Alert.Root>
          </Stack>
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
              <Alert.Root
                status={"info"}
                width={{ base: "full", md: "fit" }}
                height={"fit"}
                textAlign="center"
              >
                <Alert.Indicator />
                <Alert.Content alignItems="center">
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

        <Dialog.Root
          open={isFiltersDialogOpen}
          onOpenChange={(e) => setIsFiltersDialogOpen(e.open)}
          placement={{ base: "top", md: "center" }}
          size={{ base: "sm", md: "lg" }}
          scrollBehavior="inside"
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner padding={{ base: 4, md: 4 }}>
              <Dialog.Content
                borderRadius="xl"
                maxH={{ base: "85svh", md: "80vh" }}
              >
                <Dialog.Header>
                  <Dialog.Title>Index Filters</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <Stack
                    maxHeight={{ base: "70svh", md: "unset" }}
                    overflowY="auto"
                    overscrollBehaviorY="contain"
                    paddingRight="0.25rem"
                  >
                    {dialogFiltersContent}
                  </Stack>
                </Dialog.Body>
                <Dialog.CloseTrigger />
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Stack>
    </Stack>
  );
}
