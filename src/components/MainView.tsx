import ListItemView from "./ListItemView";
import TagFilter from "./TagFilter/TagFilter";
import Paginator from "./Paginator";
import AddTag from "./TagAdder";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getBooks } from "../utils/queries/booksApi";
import { useLocation } from "react-router-dom";
import { Button, Dialog, Portal, Stack } from "@chakra-ui/react";
import MainViewSwitch from "./MainViewSwitch";
import { orderByType } from "../types/types";
import {
  useAddTag,
  useDeleteTag,
  useRenameTag,
  useTags,
} from "../utils/Hooks/TagsHook";

const TAG_FILTER_CLOSE_DIALOG_EVENT = "tag-filter-close-dialog";

export default function View() {
  const [pn, setPn] = useState(1);
  const [take, setTake] = useState(48);
  const [tagsFilterBy, setTFB] = useState<string[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  const [isAnd, setIsAnd] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<orderByType>({
    direction: "desc",
    criteria: "lastAccess",
  });
  const [isFiltersDialogOpen, setIsFiltersDialogOpen] = useState(false);

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
  const renameTagMutation = useRenameTag();
  const deleteTagMutation = useDeleteTag();
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

  useEffect(() => {
    const closeDialog = () => setIsFiltersDialogOpen(false);
    window.addEventListener(TAG_FILTER_CLOSE_DIALOG_EVENT, closeDialog);
    return () => {
      window.removeEventListener(TAG_FILTER_CLOSE_DIALOG_EVENT, closeDialog);
    };
  }, []);
  const addTagMutation = useAddTag();
  const { data, isFetching } = useQuery({
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
    placeholderData: keepPreviousData,
  });

  const tags = useTags();

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
  const desktopFiltersContent = (
    <>
      <TagFilter
        isFavorite={location.pathname == "/favorite"}
        tags={tags || []}
        setTFB={alteredSetTFB}
        selectedValues={tagsFilterBy}
        deleteTagMutation={deleteTagMutation}
        renameTagMutation={renameTagMutation}
        filterKey="Tags"
      />
      <MainViewSwitch isAnd={isAnd} setIsAnd={setIsAnd} />
      <AddTag mutate={addTagMutation} filterKey="Tag" />
    </>
  );

  const dialogFiltersContent = (
    <>
      <TagFilter
        isFavorite={location.pathname == "/favorite"}
        tags={tags || []}
        setTFB={alteredSetTFB}
        selectedValues={tagsFilterBy}
        deleteTagMutation={deleteTagMutation}
        renameTagMutation={renameTagMutation}
        filterKey="Tags"
        disableMenuPortal
      />
      <MainViewSwitch isAnd={isAnd} setIsAnd={setIsAnd} />
      <AddTag mutate={addTagMutation} filterKey="Tag" />
    </>
  );

  return (
    <Stack direction={"row"} height={"full"}>
      {!(location.pathname == "/unclassified") && (
        <Stack
          marginRight={"-1rem"}
          marginLeft={"1rem"}
          display={{ base: "none", lg: "flex" }}
        >
          {desktopFiltersContent}
        </Stack>
      )}
      <Stack height={"full"}>
        {location.pathname != "/unclassified" && (
          <Button
            variant="outline"
            display={{ base: "block", lg: "none" }}
            marginX={"1rem"}
            marginTop={"1rem"}
            onClick={() => setIsFiltersDialogOpen(true)}
          >
            Filters
          </Button>
        )}
        <ListItemView
          books={data?.data || []}
          isLoadingBooks={isFetching}
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
          isForFTS={false}
        />
        {location.pathname != "/unclassified" && (
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
                  borderRadius={{ base: "xl", md: "xl" }}
                  maxH={{ base: "85svh", md: "80vh" }}
                >
                  <Dialog.Header>
                    <Dialog.Title>Filters</Dialog.Title>
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
        )}
        {data?.data.length != 0 && (
          <Paginator pn={pn} setPn={setPn} count={data?.count || 1} />
        )}
      </Stack>
    </Stack>
  );
}
