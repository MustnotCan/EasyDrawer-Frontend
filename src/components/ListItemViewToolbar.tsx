import { Stack } from "@chakra-ui/react";
import { orderByType } from "../types/types";
import ItemSize from "./ItemSize";
import SearchBar from "./SearchBar";
import ListItemViewSortBy from "./ListItemViewSortBy";
 

export default function ListItemViewToolbar(props: {
  setSearchInput: (arg0: string) => void;
  setTake: (arg0: number) => void;
  take: number;
  orderBy?: orderByType;
  setOrderBy?: React.Dispatch<
    React.SetStateAction<{
      criteria: string;
      direction: string;
    }>
  >;
  variant?: "desktop" | "mobile";
}) {
  const isMobile = props.variant === "mobile";

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      display={
        isMobile ? { base: "flex", lg: "none" } : { base: "none", lg: "flex" }
      }
      justify={isMobile ? "stretch" : "center"}
      align={isMobile ? "stretch" : "center"}
      gap={isMobile ? 2 : "5rem"}
      width={"full"}
      flexWrap={isMobile ? "wrap" : "nowrap"}
      paddingX={isMobile ? "0.5rem" : 0}
      paddingY={isMobile ? "0.25rem" : 0}
      borderWidth={isMobile ? "1px" : 0}
      borderColor={isMobile ? "gray.200" : "transparent"}
      borderRadius={isMobile ? "md" : 0}
      backgroundColor={isMobile ? "white" : "transparent"}
      css={
        isMobile
          ? {
              "& > *": {
                width: "100%",
              },
            }
          : undefined
      }
    >
      <ItemSize setTake={props.setTake} take={props.take} />
      <SearchBar setSearchInput={props.setSearchInput} />
      {props.orderBy && props.setOrderBy && (
        <ListItemViewSortBy
          orderBy={props.orderBy}
          setOrderBy={props.setOrderBy}
        />
      )}
    </Stack>
  );
}
