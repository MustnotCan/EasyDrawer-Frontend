import { useState } from "react";
import ItemView from "./ItemView.tsx";
import { itemViewProps, selectedItem } from "../types/types.ts";
import SearchBar from "./SearchBar.tsx";
import ItemSize from "./ItemSize.tsx";
import { Box, Button, Stack } from "@chakra-ui/react";
import { ItemContainer } from "./ItemContainer.tsx";
import { ItemContainerActionBar } from "./ItemContainerActionBar.tsx";

export default function ListItemView(args: {
  books: itemViewProps[];
  setSearchInput: (arg0: string) => void;
  setTake: (arg0: number) => void;
  queryData: unknown[];
}) {
  const [showFullname, setshowFullname] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<selectedItem[]>([]);
  return (
    <>
      <Stack direction={"row"}>
        <ItemSize setTake={args.setTake} take={args.queryData[1] as number} />
        <SearchBar setSearchInput={args.setSearchInput} />

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
                <ItemContainer
                  setSelectedItems={setSelectedItems}
                  selectedItems={selectedItems}
                  setUnSelectedItems={() => {}}
                  unSelectedItems={[]}
                  children={
                    <ItemView
                      itemView={{
                        prop: IV,
                        showFullName: showFullname,
                        itemTags: IV.tags,
                      }}
                      queryData={args.queryData}
                    />
                  }
                ></ItemContainer>
              </Box>
            );
          })}
        </Stack>
        <ItemContainerActionBar
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          ItemContainerParent={"ListItemView"}
          setUnselectedItems={() => {}}
        />
      </Stack>
    </>
  );
}
