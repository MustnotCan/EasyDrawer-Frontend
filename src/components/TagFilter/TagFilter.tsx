import { FormEvent, useEffect, useState } from "react";
import { tagWithCountType } from "../../types/types";
import { List, Stack, Button, Input } from "@chakra-ui/react";
import CheckBoxTagFilter from "./CheckBoxTagFilter";
export default function TagFilter(props: {
  tags: tagWithCountType[];
  setTFB: (arg0: string[]) => void;
  isFavorite: boolean;
}) {
  const [cBoxes, setCBoxes] = useState<string[]>(
    props.isFavorite ? ["favorite"] : []
  );
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
        <label>Filter tags:</label>
        <Input
          className="border-4 border-black "
          placeholder="Type here..."
          onChange={(e) => {
            e.stopPropagation();
            setSearchInput(e.target.value);
          }}
        />
      </Stack>
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
          maxHeight={"175px"}
          alignContent={"space-evenly"}
          marginBottom={"5px"}
        >
          {props.tags.map((tag) => (
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
