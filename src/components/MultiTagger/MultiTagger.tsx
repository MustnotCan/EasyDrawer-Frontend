import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getFilesInDir } from "../../utils/queries/booksApi";
import { Stack } from "@chakra-ui/react";
import { MultiTaggerFile } from "./MultiTaggerFile";
import { MultiTaggerFolder } from "./MultiTaggerFolder";
import { ItemContainer } from "../ItemContainer/ItemContainer";
import { selectedItemType, tagType } from "../../types/types";
import { ItemContainerActionBar } from "../ItemContainer/ItemContainerActionBar";
import { MultiTaggerBreadCrumb } from "./MultiTaggerBreadCrumb";
import { getTags } from "../../utils/queries/tagsApi";
import { MultiTaggerImport } from "./MultiTaggerImport";

export default function MultiTagger() {
  const [dirs, setDir] = useState<string[]>([""]);
  const [selectedItems, setSelectedItems] = useState<selectedItemType[]>([]);
  const [unSelectedItems, setUnSelectedItems] = useState<selectedItemType[]>(
    []
  );
  const tags = useQuery({ queryKey: ["tags"], queryFn: getTags })
    .data as tagType[];
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
    <Stack direction={"column"}>
      <Stack direction={"column"}>
        <MultiTaggerImport dirs={dirs} />
      </Stack>
      <MultiTaggerBreadCrumb dirs={dirs} setDir={setDir} />
      <Stack>
        <Stack>
          <Stack direction={"row"} wrap={"wrap"}>
            {data.data
              ?.filter((item) => typeof item === "string")
              .sort()
              .map((item) => {
                return (
                  <Stack className="hover:cursor-pointer" key={item}>
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
                  </Stack>
                );
              })}
          </Stack>
          <Stack direction={"row"} wrap={"wrap"}>
            {data.data
              ?.filter((item) => typeof item !== "string")
              .sort()
              .map((item) => {
                return (
                  <Stack className="hover:cursor-pointer" key={item.id}>
                    <ItemContainer
                      children={<MultiTaggerFile item={item} />}
                      selectedItems={selectedItems}
                      unSelectedItems={unSelectedItems}
                      setSelectedItems={setSelectedItems}
                      setUnSelectedItems={setUnSelectedItems}
                    />
                  </Stack>
                );
              })}
          </Stack>
        </Stack>
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
