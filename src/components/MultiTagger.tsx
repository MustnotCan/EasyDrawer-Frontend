//Multitagger should be a simple UI that lists the contents of a directory, and allows for things like selection of items
//renaming deleting and everything that's supposed to be in a file browser

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getBooks, getFilesInDir } from "../utils/queries/booksApi";
import { getTags } from "../utils/queries/tagsApi";
import { THUMBS_URL } from "../utils/envVar";
import { Breadcrumb, Stack } from "@chakra-ui/react";

export default function MultiTagger() {
  const [pn, setPn] = useState(1);
  const [take, setTake] = useState(10);
  const [dirs, setDir] = useState<string[]>([""]);
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
        <Breadcrumb.Root variant={"underline"}>
          <Breadcrumb.List>
            {dirs.map((dir, index) => (
              <>
                <Breadcrumb.Item
                  key={dir}
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
              </>
            ))}
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <Stack>
          <Stack direction={"row"} wrap={"wrap"}>
            {data.data?.map((value, index) => {
              if (typeof value == "string") {
                return (
                  <div
                    style={{
                      borderStyle: "solid",
                      margin: "10px",
                      height: "20px",
                    }}
                    key={value}
                    onClick={() => setDir((dirs) => [...dirs, value])}
                  >
                    {index}-{value}
                  </div>
                );
              } else {
                return (
                  <div key={value.id}>
                    {" "}
                    <img
                      src={THUMBS_URL + value.thumbnail}
                      alt={value.title}
                    ></img>
                    <label>{value.title}</label>
                  </div>
                );
              }
            })}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
