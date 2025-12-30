import { FormEvent, useEffect, useState } from "react";
import { tagWithCountType } from "../../types/types";
import { List, Stack, Button, Input } from "@chakra-ui/react";
import CheckBoxTagFilter from "./CheckBoxTagFilter";
import { UseMutateFunction } from "@tanstack/react-query";
import { EnqueuedTask } from "meilisearch";
import { useTags } from "../../utils/Hooks/TagsHook";
export default function TagFilter(props: {
  tags: tagWithCountType[];
  setTFB: (arg0: string[]) => void;
  isFavorite: boolean;
  renameTagMutation?: UseMutateFunction<
    { id: string; name: string },
    Error,
    { newName: string; prevName: string },
    unknown
  >;
  deleteTagMutation:
    | UseMutateFunction<
        { id: string; name: string },
        Error,
        { name: string },
        unknown
      >
    | UseMutateFunction<
        EnqueuedTask | undefined,
        Error,
        {
          name: string;
        },
        unknown
      >;
  filterKey: string;
}) {
  const [cBoxes, setCBoxes] = useState<string[]>(
    props.isFavorite ? ["favorite"] : []
  );
  const tags = useTags();
  const [searchInput, setSearchInput] = useState<string>("");
  useEffect(() => {
    if (props.isFavorite) {
      setCBoxes(["favorite"]);
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
    props.setTFB(cBoxes);
  };
  const clearFilter = () => setCBoxes(props.isFavorite ? ["favorite"] : []);

  return (
    <Stack>
      <Stack>
        <label>Filter {props.filterKey}:</label>
        <Input
          className="border-4 border-black "
          placeholder="Type here..."
          onChange={(e) => {
            e.stopPropagation();
            setSearchInput(e.target.value);
          }}
        />
      </Stack>
      <form method="post" onSubmit={formAction} id="tagFilteringForm">
        <label htmlFor={props.filterKey}>
          {props.filterKey[0].toUpperCase() + props.filterKey.slice(1)}:
        </label>
        <List.Root
          variant={"plain"}
          overflowX={"auto"}
          maxHeight={"50vh"}
          alignContent={"space-evenly"}
          marginBottom={"5px"}
          width={"10vw"}
        >
          {(props.tags ? props.tags : tags)
            .sort((a, b) => {
              const priority: Record<string, number> = {
                bin: 0,
                favorite: 1,
              };
              const aPriority = priority[a.name] ?? 2;
              const bPriority = priority[b.name] ?? 2;

              if (aPriority !== bPriority) {
                return aPriority - bPriority;
              }
              return a.name.localeCompare(b.name);
            })
            .map((tag) => (
              <List.Item key={tag.id}>
                {!(tag.name.toLowerCase() == "favorite" && props.isFavorite) &&
                  !(tag.name.toLowerCase() == "unclassified") &&
                  (searchInput.toLocaleLowerCase() != ""
                    ? tag.name.toLocaleLowerCase().includes(searchInput)
                    : true) && (
                    <CheckBoxTagFilter
                      cBoxes={cBoxes}
                      onChangeHandler={onChangeHandler}
                      tag={tag}
                      renameTagMutation={props.renameTagMutation}
                      deleteTagMutation={props.deleteTagMutation}
                      filterKey={props.filterKey}
                    />
                  )}
              </List.Item>
            ))}
        </List.Root>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Button variant={"outline"} type="submit">
            Apply
          </Button>
          <Button variant={"outline"} type="submit" onClick={clearFilter}>
            Clear
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
