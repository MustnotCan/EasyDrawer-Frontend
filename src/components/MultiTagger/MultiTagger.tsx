import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getFilesInDir } from "../../utils/queries/booksApi";
import { Box, Grid, GridItem, Stack } from "@chakra-ui/react";
import { MultiTaggerFile } from "./MultiTaggerFile";
import { MultiTaggerFolder } from "./MultiTaggerFolder";
import { ItemContainer } from "../ItemContainer/ItemContainer";
import { selectedItemType, tagWithCountType } from "../../types/types";
import { ItemContainerActionBar } from "../ItemContainer/ItemContainerActionBar";
import { MultiTaggerBreadCrumb } from "./MultiTaggerBreadCrumb";
import { MultiTaggerImport } from "./MultiTaggerImport";
import { useLocation } from "react-router-dom";
import { useTags } from "../../utils/Hooks/TagsHook";

export default function MultiTagger() {
  const location = useLocation();
  const [dirs, setDir] = useState<string[]>(
    location.state?.at(0).split("/") || [""],
  );
  const [selectedItems, setSelectedItems] = useState<selectedItemType[]>(
    location.state?.at(1)
      ? [{ path: location.state?.at(1), type: "file" }]
      : [],
  );
  const [unSelectedItems, setUnSelectedItems] = useState<selectedItemType[]>(
    [],
  );
  const tags = useTags() as tagWithCountType[];
  const data = useQuery({
    queryKey: ["Dirs&files", dirs],
    queryFn: ({ queryKey }) => {
      return getFilesInDir({
        dirs: queryKey[1] as string[],
      });
    },
    staleTime: Infinity,
  });
  return (
    <Stack direction={"column"} height={"full"}>
      <MultiTaggerImport dirs={dirs} />
      <MultiTaggerBreadCrumb dirs={dirs} setDir={setDir} />
      <Stack>
        <Grid
          gridTemplateColumns={{
            base: "repeat(3, 33vw)",
            sm: "repeat(6, 16vw)",
            lg: "repeat(7, 12.5vw)",
          }}
          gridAutoRows="max-content"
          width={"full"}
          scrollbar={"hidden"}
        >
          {data.data
            ?.filter((item) => typeof item === "string")
            .sort()
            .map((item) => {
              return (
                <GridItem className="hover:cursor-pointer" key={item}>
                  <Box key={item} margin={"1rem"}>
                    <ItemContainer
                      children={
                        <MultiTaggerFolder
                          item={item}
                          setDir={setDir}
                          path={[...dirs, item].join("/")}
                        />
                      }
                      selectedItems={selectedItems}
                      unSelectedItems={unSelectedItems}
                      setSelectedItems={setSelectedItems}
                      setUnSelectedItems={setUnSelectedItems}
                    />
                  </Box>
                </GridItem>
              );
            })}
        </Grid>
        <Grid
          margin={0}
          padding={0}
          gridTemplateColumns={{
            base: "repeat(3, 33vw)",
            sm: "repeat(6, 16vw)",
            lg: "repeat(7, 12.5vw)",
          }}
          gridAutoRows="max-content"
          width={"full"}
          scrollbar={"hidden"}
        >
          {data.data
            ?.filter((item) => typeof item !== "string")
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((item) => {
              return (
                <GridItem className="hover:cursor-pointer" key={item.id}>
                  <Box key={item.id} margin={"1rem"}>
                    <ItemContainer
                      children={<MultiTaggerFile item={item} />}
                      selectedItems={selectedItems}
                      unSelectedItems={unSelectedItems}
                      setSelectedItems={setSelectedItems}
                      setUnSelectedItems={setUnSelectedItems}
                    />
                  </Box>
                </GridItem>
              );
            })}
        </Grid>
      </Stack>
      <ItemContainerActionBar
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        ItemContainerParent={"MultiTagger"}
        setUnselectedItems={setUnSelectedItems}
        unselectedItems={unSelectedItems}
        tags={tags}
        setDir={setDir}
        dirs={dirs}
      />
    </Stack>
  );
}
