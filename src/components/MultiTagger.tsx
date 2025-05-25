//Multitagger should be a simple UI that lists the contents of a directory, and allows for things like selection of items
//renaming deleting and everything that's supposed to be in a file browser

import { useQuery } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { getFilesInDir } from "../utils/queries/booksApi";
import { Breadcrumb, Stack } from "@chakra-ui/react";
import { MultiTaggerFile } from "./MultiTaggerFile";
import { MultiTaggerFolder } from "./MultiTaggerFolder";
import { ItemContainer } from "./ItemContainer";
import { selectedItem } from "@/types/types";
import { ItemContainerActionBar } from "./ItemContainerActionBar";

export default function MultiTagger() {
  const [pn] = useState(1);
  const [take] = useState(10);
  const [dirs, setDir] = useState<string[]>([""]);
  const [selectedItems, setSelectedItems] = useState<selectedItem[]>([]);

  const data = useQuery({
    queryKey: ["Dirs&files", dirs, pn, take],
    queryFn: ({ queryKey }) => {
      return getFilesInDir({
        dirs: queryKey[1] as string[],
        pn: queryKey[2] as number,
        take: queryKey[3] as number,
      });
    },
  });

  return (
    <>
      <Stack direction={"column"}>
        <Breadcrumb.Root variant={"plain"}>
          <Breadcrumb.List>
            {dirs.map((dir, index) => (
              <Fragment key={dir}>
                <Breadcrumb.Item
                  className="hover:cursor-pointer"
                  onClick={() =>
                    setDir((prev) => {
                      const indexOfDir = prev.indexOf(dir);
                      return prev.slice(0, indexOfDir + 1);
                    })
                  }
                >
                  {index == 0 ? "root" : dir}
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
              </Fragment>
            ))}
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <Stack>
          <Stack direction={"row"} wrap={"wrap"}>
            {data.data?.map((item) => {
              const selected =
                selectedItems
                  .filter(
                    (i) =>
                      i.type === (typeof item == "string" ? "folder" : "file")
                  )
                  .map((i) => i.path)
                  .includes(
                    typeof item === "string"
                      ? [...dirs].join("/") + item
                      : item.path + "/" + item.title
                  ) ||
                selectedItems.includes(
                  typeof item == "string"
                    ? {
                        type: "folder",
                        path: item.slice(0, item.lastIndexOf("/")),
                      }
                    : {
                        type: "folder",
                        path: item.path,
                      }
                );
              return (
                <Stack
                  className="hover:cursor-pointer"
                  key={typeof item == "string" ? item : item.id}
                >
                  <ItemContainer
                    children={
                      typeof item == "string" ? (
                        <MultiTaggerFolder
                          item={item}
                          setDir={setDir}
                          path={[...dirs, item].join("/")}
                        />
                      ) : (
                        <MultiTaggerFile item={item} />
                      )
                    }
                    selected={selected}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                  />
                </Stack>
              );
            })}
          </Stack>
        </Stack>
        <ItemContainerActionBar
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          ItemContainerParent={"MultiTagger"}
        />
      </Stack>
    </>
  );
}
