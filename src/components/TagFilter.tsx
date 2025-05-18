"use client";
import { FormEvent, useEffect, useState } from "react";
import { tagType } from "../types/types";
import { List, Stack, Button } from "@chakra-ui/react";
import CheckBoxTagFilter from "./CheckBoxTagFilter";
export default function TagFilter(props: {
  tags: tagType[];
  setTFB: (arg0: string[]) => void;
  isFavorite: boolean;
}) {
  const [cBoxes, setCBoxes] = useState<string[]>(
    props.isFavorite ? ["Favorite"] : []
  );

  useEffect(() => {
    if (props.isFavorite) {
      setCBoxes(["Favorite"]);
    } else {
      setCBoxes([]);
    }
  }, [props.isFavorite]);
  const onChangeHandler = (name: string) => {
    if (cBoxes?.includes(name)) {
      setCBoxes(cBoxes.filter((cb) => cb != name));
    } else {
      const box = cBoxes?.concat([name]);
      setCBoxes(box);
    }
  };
  const formAction = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cBoxes.includes("Unclassified") && cBoxes.length > 1) {
      return new Error(
        "A book cannot be unclassified and have a tag at the same time"
      );
    }
    props.setTFB(cBoxes);
  };
  const clearFilter = () => setCBoxes(props.isFavorite ? ["Favorite"] : []);

  return (
    <Stack>
      <form
        className=""
        method="post"
        onSubmit={formAction}
        id="tagFilteringForm"
      >
        <label htmlFor="tags">Tags:</label>
        <List.Root
          variant={"plain"}
          overflowX={"auto"}
          maxHeight={"170px"}
          marginBottom={"5px"}
        >
          {props.tags.map((tag) => (
            <List.Item key={tag.id}>
              {!(tag.name.toLowerCase() == "favorite" && props.isFavorite) &&
                !(tag.name.toLowerCase() == "unclassified") && (
                  <CheckBoxTagFilter
                    cBoxes={cBoxes}
                    onChangeHandler={onChangeHandler}
                    tag={tag}
                  />
                )}
            </List.Item>
          ))}
        </List.Root>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Button variant={"outline"} type="submit">
            Filter
          </Button>
          <Button variant={"outline"} type="submit" onClick={clearFilter}>
            Clear Filters
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
