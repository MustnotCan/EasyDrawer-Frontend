import { FormEvent, useState } from "react";
import {
  listItemViewQueryDataType,
  multiTaggerQueryDataType,
  tagAdderPropsType,
} from "../types/types";
import { Button, Checkbox, Input, Stack } from "@chakra-ui/react";
import { useMultiTaggerBookTagsMutation } from "../utils/Hooks/MultiTaggerHooks";
import { useItemViewBookTagsMutation } from "../utils/Hooks/ItemViewHook";
import { Toaster, toaster } from "../ui/toaster";
export default function TagList(props: tagAdderPropsType) {
  const [cBoxes, setCBoxes] = useState<string[]>(
    props.itemTags
      ? props.itemTags.map((iT) => iT.id)
      : props.sharedTags?.map((iT) => iT.id) || []
  );
  const [searchInput, setSearchInput] = useState<string>("");
  const [toRemTags, setToRemTags] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const onChangeHandler = (id: string) => {
    setCBoxes((prevCBoxes) => {
      if (prevCBoxes.includes(id)) {
        setToRemTags((tRT) => {
          return [...tRT, id];
        });
        return prevCBoxes.filter((cb) => cb !== id);
      } else {
        return [...prevCBoxes, id];
      }
    });
  };
  const mutateItemView = useItemViewBookTagsMutation(
    props.queryData as listItemViewQueryDataType,
    setIsSaved
  );
  const mutateMultiTager = useMultiTaggerBookTagsMutation(
    props.queryData as multiTaggerQueryDataType,
    setIsSaved
  );
  const formAction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (props.name) {
      mutateItemView.mutate({
        addedTags: cBoxes,
        removedTags: Array.from(new Set([...toRemTags])),
        name: props.name,
      });
    } else if (props.data) {
      mutateMultiTager.mutate({
        addedTags: cBoxes,
        removedTags: Array.from(new Set([...toRemTags])),
        data: props.data,
      });
    }
  };
  return (
    <Stack
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <Stack>
        <label>Find tag:</label>
        <Input
          className="border-4 border-black "
          placeholder="Type here..."
          onChange={(e) => {
            e.stopPropagation();
            setSearchInput(e.target.value);
          }}
        />
      </Stack>
      <form method="post" onSubmit={formAction} id="tagAddingForm">
        <label htmlFor="tags">Tags:</label>
        <Stack overflow={"auto"} maxHeight={"170px"}>
          {props.tags
            .filter((tag) =>
              searchInput.toLocaleLowerCase() != ""
                ? tag.name.toLocaleLowerCase().includes(searchInput)
                : true
            )
            .map(
              (tag) =>
                tag.name != "unclassified" &&
                (!props.isMultiTag ? tag.name != "favorite" : true) && (
                  <Checkbox.Root
                    id={tag.id}
                    onClick={() => onChangeHandler(tag.id)}
                    checked={cBoxes.includes(tag.id)}
                    variant={"subtle"}
                    key={tag.id}
                  >
                    <Checkbox.Control />
                    <Checkbox.Label
                      height={"30px"}
                      width={"80px"}
                      maxWidth="100px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {tag.name[0].toUpperCase() + tag.name.slice(1)}{" "}
                    </Checkbox.Label>
                  </Checkbox.Root>
                )
            )}
        </Stack>
        <Button
          variant={"outline"}
          type="submit"
          onClick={() => {
            if (!isSaved) {
              setIsSaved(!isSaved);
              const toastId = toaster.create({
                description: "Tags saved successfully",
                type: "success",
                closable: true,
                action: {
                  label: "X",
                  onClick: () => toaster.dismiss(toastId),
                },
              });
            }
          }}
        >
          Save
        </Button>
      </form>
      <Toaster />
    </Stack>
  );
}
