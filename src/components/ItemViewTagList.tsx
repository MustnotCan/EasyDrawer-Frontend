import { FormEvent, useEffect, useRef, useState } from "react";
import {
  listItemViewQueryDataType,
  multiTaggerQueryDataType,
  tagAdderPropsType,
} from "../types/types";
import { Box, Button, Checkbox, Input, Stack } from "@chakra-ui/react";
import { useMultiTaggerBookTagsMutation } from "../utils/Hooks/MultiTaggerHooks";
import {
  useChangeTagsBarMutation,
  useItemViewBookTagsMutation,
} from "../utils/Hooks/ItemViewHook";
import { Toaster, toaster } from "../ui/toaster";
import { Tooltip } from "../ui/tooltip";
export default function TagList(props: tagAdderPropsType) {
  const [cBoxes, setCBoxes] = useState<string[]>(
    props.itemTags
      ? props.itemTags.map((iT) => iT.id)
      : props.sharedTags?.map((iT) => iT.id) || [],
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
    setIsSaved,
  );
  const multiMutateItemView = useChangeTagsBarMutation(
    props.queryData as listItemViewQueryDataType,
    setIsSaved,
  );
  const mutateMultiTager = useMultiTaggerBookTagsMutation(
    props.queryData as multiTaggerQueryDataType,
    setIsSaved,
  );
  const formAction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (props.path) {
      mutateItemView.mutate({
        addedTags: cBoxes,
        removedTags: Array.from(new Set([...toRemTags])),
        path: props.path,
      });
    } else if (!props.isMultiTag) {
      multiMutateItemView.mutate({
        addedTags: cBoxes,
        removedTags: Array.from(new Set([...toRemTags])),
        data: props.data || [],
      });
    } else if (props.isMultiTag) {
      mutateMultiTager.mutate({
        addedTags: cBoxes,
        removedTags: Array.from(new Set([...toRemTags])),
        data: props.data || [],
      });
    }
  };
  return (
    <Stack
      maxWidth={"100%"}
      minWidth={0}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <Stack minWidth={0}>
        <label>Find tag:</label>
        <Input
          className="border-4 border-black "
          minWidth={0}
          placeholder="Type here..."
          onChange={(e) => {
            e.stopPropagation();
            setSearchInput(e.target.value);
          }}
        />
      </Stack>
      <form
        method="post"
        onSubmit={formAction}
        id="tagAddingForm"
        style={{ width: "100%", minWidth: 0 }}
      >
        <label htmlFor="tags">Tags:</label>
        <Stack
          overflow={"auto"}
          height={"17vh"}
          width={"full"}
          minWidth={0}
          overscrollBehaviorY={"contain"}
          overscrollBehaviorX={"contain"}
          css={{ WebkitOverflowScrolling: "touch" }}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {props.tags
            .filter((tag) =>
              searchInput.toLocaleLowerCase() != ""
                ? tag.name.toLocaleLowerCase().includes(searchInput)
                : true,
            )
            .map(
              (tag) =>
                tag.name != "unclassified" &&
                (!props.isMultiTag ? tag.name != "favorite" : true) && (
                  <Checkbox.Root
                    id={tag.id}
                    checked={cBoxes.includes(tag.id)}
                    variant={"subtle"}
                    key={tag.id}
                    width={"full"}
                    minWidth={0}
                  >
                    <Checkbox.Control
                      onClick={(e) => {
                        e.stopPropagation();
                        onChangeHandler(tag.id);
                      }}
                    />
                    <Checkbox.Label
                      height={"30px"}
                      minWidth={0}
                      maxWidth="100%"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      flex={1}
                      onClick={(e) => {
                        e.stopPropagation();
                        onChangeHandler(tag.id);
                      }}
                    >
                      <Tooltip
                        content={tag.name[0].toUpperCase() + tag.name.slice(1)}
                      >
                        <Box
                          maxWidth={"100%"}
                          overflow={"hidden"}
                          textOverflow={"ellipsis"}
                        >
                          {tag.name[0].toUpperCase() + tag.name.slice(1)}
                        </Box>
                      </Tooltip>
                    </Checkbox.Label>
                  </Checkbox.Root>
                ),
            )}
        </Stack>
        <Button
          variant={"outline"}
          type="submit"
          onClick={() => {
            if (!isSaved) {
              setIsSaved(!isSaved);
              toaster.create({
                description: "Tags saved successfully",
                type: "success",
                closable: true,
                duration: 3000,
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
