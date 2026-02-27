import { memo, useMemo, useRef, useState } from "react";
import ItemView from "./ItemView.tsx";
import {
  itemViewPropsType,
  listItemViewQueryDataType,
  orderByType,
  selectedItemType,
} from "../types/types.ts";
import { Box, Grid, GridItem, Spinner, Stack, Text } from "@chakra-ui/react";
import { ItemContainer } from "./ItemContainer/ItemContainer.tsx";
import { ItemContainerActionBar } from "./ItemContainer/ItemContainerActionBar.tsx";
import ListItemViewToolbar from "./ListItemViewToolbar.tsx";

function ListItemGridCell(props: {
  item: itemViewPropsType;
  queryData: listItemViewQueryDataType;
  isSelected: boolean;
  multiSelectActive: boolean;
  selectedItemsRef: React.MutableRefObject<selectedItemType[]>;
  unSelectedItemsRef: React.MutableRefObject<selectedItemType[]>;
  setSelectedItems: React.Dispatch<React.SetStateAction<selectedItemType[]>>;
}) {
  return (
    <GridItem>
      <Box margin={"1rem"}>
        <ItemContainer
          setSelectedItems={props.setSelectedItems}
          selectedItems={props.selectedItemsRef.current}
          selectedItemsRef={props.selectedItemsRef}
          setUnSelectedItems={() => {}}
          unSelectedItems={[]}
          unSelectedItemsRef={props.unSelectedItemsRef}
          forceSelected={props.isSelected}
          multiSelectActive={props.multiSelectActive}
          children={
            <ItemView
              itemView={{
                prop: props.item,
                itemTags: props.item.tags,
              }}
              queryData={props.queryData}
            />
          }
        />
      </Box>
    </GridItem>
  );
}

const MemoListItemGridCell = memo(
  ListItemGridCell,
  (prev, next) =>
    prev.item === next.item &&
    prev.queryData === next.queryData &&
    prev.isSelected === next.isSelected &&
    prev.multiSelectActive === next.multiSelectActive &&
    prev.selectedItemsRef === next.selectedItemsRef &&
    prev.unSelectedItemsRef === next.unSelectedItemsRef &&
    prev.setSelectedItems === next.setSelectedItems,
);

export default function ListItemView(props: {
  books: itemViewPropsType[];
  setSearchInput: (arg0: string) => void;
  setTake: (arg0: number) => void;
  queryData: listItemViewQueryDataType;
  isLoadingBooks?: boolean;
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
  const selectedItemsRef = useRef<selectedItemType[]>(selectedItems);
  selectedItemsRef.current = selectedItems;
  const emptyUnselectedRef = useRef<selectedItemType[]>([]);
  const selectedFilePathSet = useMemo(() => {
    const set = new Set<string>();
    for (const item of selectedItems) {
      if (item.type === "file") set.add(item.path);
    }
    return set;
  }, [selectedItems]);
  const multiSelectActive = selectedItems.length >= 1;
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  return (
    <Stack height={{ base: "full", lg: "fit" }} padding={"1rem"}>
      <ListItemViewToolbar
        variant={isTouchDevice ? "mobile" : "desktop"}
        setTake={props.setTake}
        take={props.queryData[1] as number}
        setSearchInput={props.setSearchInput}
        orderBy={props.orderBy}
        setOrderBy={props.setOrderBy}
      />
      {props.books.length > 0 ? (
        <>
          <Grid
            margin={0}
            padding={0}
            gridTemplateColumns={{
              base: "repeat(3, 30vw)",
              sm: "repeat(6, 16vw)",
              lg: "repeat(6, 13vw)",
            }}
            gridAutoRows="max-content"
            width={"full"}
            scrollbar={"hidden"}
          >
            {props.books.map((IV: itemViewPropsType) => {
              const filePath = IV.path + "/" + IV.title;
              return (
                <MemoListItemGridCell
                  key={IV.id}
                  item={IV}
                  queryData={props.queryData}
                  isSelected={selectedFilePathSet.has(filePath)}
                  multiSelectActive={multiSelectActive}
                  selectedItemsRef={selectedItemsRef}
                  unSelectedItemsRef={emptyUnselectedRef}
                  setSelectedItems={setSelectedItems}
                />
              );
            })}
          </Grid>
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
        </>
      ) : props.isLoadingBooks ? (
        <Stack align={"center"} justify={"center"} paddingY={"2rem"}>
          <Spinner size={"sm"} />
          <Text fontSize={"sm"} color={"gray.500"}>
            Loading books...
          </Text>
        </Stack>
      ) : (
        !props.isForFTS && (
          <Text
            textAlign={"center"}
            color={"gray.500"}
            paddingY={"2rem"}
            fontSize={{ base: "sm", lg: "md" }}
          >
            No book found
          </Text>
        )
      )}
    </Stack>
  );
}
