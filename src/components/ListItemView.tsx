import { useState } from "react";
import ItemView from "./ItemView.tsx";
import {
  itemViewPropsType,
  listItemViewQueryDataType,
  orderByType,
  selectedItemType,
} from "../types/types.ts";
import SearchBar from "./SearchBar.tsx";
import ItemSize from "./ItemSize.tsx";
import { Box, Stack } from "@chakra-ui/react";
import { ItemContainer } from "./ItemContainer/ItemContainer.tsx";
import { ItemContainerActionBar } from "./ItemContainer/ItemContainerActionBar.tsx";
import ListItemViewSortBy from "./ListItemViewSortBy.tsx";

export default function ListItemView(props: {
  books: itemViewPropsType[];
  setSearchInput: (arg0: string) => void;
  setTake: (arg0: number) => void;
  queryData: listItemViewQueryDataType;
  orderBy?: orderByType;
  setOrderBy?: React.Dispatch<
    React.SetStateAction<{
      criteria: string;
      direction: string;
    }>
  >;
  isForFTS: boolean;
}) {
  const [selectedItems, setSelectedItems] = useState<selectedItemType[]>([]);

  return (
    <>
      <Stack direction={"row"}>
        <ItemSize setTake={props.setTake} take={props.queryData[1] as number} />
        <SearchBar setSearchInput={props.setSearchInput} />
        {/*add the sorting*/}
        {props.orderBy && props.setOrderBy && (
          <ListItemViewSortBy
            orderBy={props.orderBy}
            setOrderBy={props.setOrderBy}
          />
        )}
      </Stack>
      {props.books.length > 0 ? (
        <Stack>
          <Stack direction={"row"} wrap={"wrap"}>
            {props.books.map((IV: itemViewPropsType) => {
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
                          itemTags: IV.tags,
                        }}
                        queryData={props.queryData}
                      />
                    }
                  />
                </Box>
              );
            })}
          </Stack>
          <ItemContainerActionBar
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            ItemContainerParent={"ListItemView"}
            setUnselectedItems={() => {}}
            unselectedItems={[]}
            setDir={() => {}}
            tags={[]}
            dirs={[]}
            queryData={props.queryData}
          />
        </Stack>
      ) : (
        !props.isForFTS && <p>No book found</p>
      )}
    </>
  );
}
