import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getFilesInDir } from "../../utils/queries/booksApi";
import { Stack } from "@chakra-ui/react";
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
    location.state?.at(0).split("/") || [""]
  );
  const [selectedItems, setSelectedItems] = useState<selectedItemType[]>(
    location.state?.at(1) ? [{ path: location.state?.at(1), type: "file" }] : []
  );
  const [unSelectedItems, setUnSelectedItems] = useState<selectedItemType[]>(
    []
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
              .sort((a, b) => a.title.localeCompare(b.title))
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
