import { useCallback, useRef, useState } from "react";
import ItemView from "./ItemView.tsx";
import { itemViewProps } from "../types/types.ts";
import SearchBar from "./SearchBar.tsx";
import ItemSize from "./ItemSize.tsx";
import {
  ActionBar,
  Box,
  Button,
  CloseButton,
  Portal,
  Stack,
} from "@chakra-ui/react";

export default function ListItemView(args: {
  books: itemViewProps[];
  setSearchInput: (arg0: string) => void;
  setTake: (arg0: number) => void;
  queryData: unknown[];
}) {
  const [showFullname, setshowFullname] = useState<boolean>(false);
  //Items are added by title
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const selectionMode = useRef(false);
  const firstRef = useRef(true);
  const addToSelected = (item: string) => {
    setSelectedItems((prev) => (prev.includes(item) ? prev : [...prev, item]));
  };

  const clearSelected = useCallback(() => {
    setSelectedItems([]);
    selectionMode.current = false;
    firstRef.current = true;
  }, []);

  const removeFromSelected = (item: string) => {
    setSelectedItems((prev) => {
      const newList = prev.filter((si) => si !== item);
      if (newList.length == 0) {
        selectionMode.current = false;
        firstRef.current = true;
      }
      return newList;
    });
  };
  const toggleSelected = (item: string) => {
    if (selectedItems.includes(item)) {
      removeFromSelected(item);
    } else {
      addToSelected(item);
    }
  };
  return (
    <>
      <Stack direction={"row"}>
        <ItemSize setTake={args.setTake} take={args.queryData[1] as number} />
        <SearchBar setSearchInput={args.setSearchInput} />
        <ActionBar.Root
          open={selectedItems.length > 0}
          closeOnInteractOutside={false}
        >
          <Portal>
            <ActionBar.Positioner>
              <ActionBar.Content>
                <ActionBar.SelectionTrigger>
                  {selectedItems.length} selected
                </ActionBar.SelectionTrigger>
                <ActionBar.Separator />
                <Button variant="outline" size="sm">
                  Still thinking about buttons
                </Button>
                <ActionBar.CloseTrigger asChild onClick={clearSelected}>
                  <CloseButton size="sm" />
                </ActionBar.CloseTrigger>
              </ActionBar.Content>
            </ActionBar.Positioner>
          </Portal>
        </ActionBar.Root>

        <Stack>
          <Button
            variant={"outline"}
            onClick={() => {
              setshowFullname(!showFullname);
            }}
          >
            {showFullname == true ? "Hide" : "Show"} full name
          </Button>
        </Stack>
      </Stack>
      <Stack>
        <Stack direction={"row"} wrap={"wrap"} gap={"4"}>
          {args.books.map((IV: itemViewProps) => {
            const selected = selectedItems.includes(IV.title);
            return (
              <Box
                key={IV.id}
                width={"max-content"}
                justifyItems={"center"}
                marginRight={"10"}
                marginTop={"3"}
                marginLeft={"0"}
                marginBottom={"5"}
              >
                <ItemView
                  addToSelected={addToSelected}
                  toggleSelected={(item: string) => toggleSelected(item)}
                  itemView={{
                    prop: IV,
                    showFullName: showFullname,
                    itemTags: IV.tags,
                  }}
                  selected={selected}
                  isSelectionMode={selectionMode.current}
                  setSelectionMode={(bool: boolean) =>
                    (selectionMode.current = bool)
                  }
                  isFirst={firstRef}
                  queryData={args.queryData}
                />
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </>
  );
}
