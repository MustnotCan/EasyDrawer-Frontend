import { FormEvent, useEffect, useState } from "react";
import { tagWithCountType } from "../../types/types";
import { List, Stack, Button, Input } from "@chakra-ui/react";
import CheckBoxTagFilter from "./CheckBoxTagFilter";
import { useTags } from "../../utils/Hooks/TagsHook";

const TAG_FILTER_CLOSE_DIALOG_EVENT = "tag-filter-close-dialog";

export default function TagFilter(props: {
  tags: tagWithCountType[];
  setTFB: (arg0: string[]) => void;
  isFavorite: boolean;
  selectedValues?: string[];
  disableMenuPortal?: boolean;
  deleteTagMutation: ({ name }: { name: string }) => void;
  renameTagMutation?: ({
    newName,
    prevName,
  }: {
    newName: string;
    prevName: string;
  }) => void;
  filterKey: string;
}) {
  const initialSelected = props.selectedValues
    ? [...props.selectedValues]
    : props.isFavorite
      ? ["favorite"]
      : [];
  const [cBoxes, setCBoxes] = useState<string[]>(initialSelected);
  const tags = useTags();
  const [searchInput, setSearchInput] = useState<string>("");
  useEffect(() => {
    if (props.selectedValues) {
      setCBoxes([...props.selectedValues]);
      return;
    }
    if (props.isFavorite) setCBoxes(["favorite"]);
    else setCBoxes([]);
  }, [props.isFavorite, props.selectedValues]);
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
    window.dispatchEvent(new CustomEvent(TAG_FILTER_CLOSE_DIALOG_EVENT));
  };
  const clearFilter = () => {
    const next = props.isFavorite ? ["favorite"] : [];
    setCBoxes(next);
    props.setTFB(next);
    window.dispatchEvent(new CustomEvent(TAG_FILTER_CLOSE_DIALOG_EVENT));
  };

  return (
    <Stack
      maxWidth={"100%"}
      minWidth={0}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <Stack minWidth={0} onFocus={(e) => e.target.blur()}>
        <label>Filter {props.filterKey}:</label>
        <Input
          className=" border-4 border-black "
          minWidth={0}
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
          overflowX={"visible"}
          overflowY={"auto"}
          maxHeight={{ base: "25dvh", lg: "50dvh" }}
          minHeight={"2.5rem"}
          justifyItems={"center"}
          flex={1}
          scrollbar={{ base: "visible", lg: "hidden" }}
          gap={1}
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
                      disableMenuPortal={props.disableMenuPortal}
                      renameTagMutation={props.renameTagMutation!}
                      deleteTagMutation={props.deleteTagMutation}
                      filterKey={props.filterKey}
                    />
                  )}
              </List.Item>
            ))}
        </List.Root>
        <Stack direction={"row"} justifyContent={"space-around"}>
          <Button variant={"outline"} type="submit" size={"xs"}>
            Apply
          </Button>
          <Button
            variant={"outline"}
            type="button"
            size={"xs"}
            onClick={clearFilter}
          >
            Clear
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
