import { FormEvent, useState } from "react";
import { changeTags, multiChangeTags } from "../utils/queries/booksApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  itemViewPropsType,
  onlyPathAndTagsType,
  reqBodyType,
  tagAdderPropsType,
} from "../types/types";
import { Box, Button, Checkbox, Input, Stack } from "@chakra-ui/react";
export default function TagAdder(props: tagAdderPropsType) {
  const queryClient = useQueryClient();
  const [cBoxes, setCBoxes] = useState<string[]>(
    props.itemTags
      ? props.itemTags.map((iT) => iT.id)
      : props.sharedTags?.map((iT) => iT.id) || []
  );
  const [searchInput, setSearchInput] = useState<string>("");
  const [toRemTags, setToRemTags] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const onChangeHandler = (id: string) => {
    if (setIsSaved) {
      setIsSaved(false);
    }
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

  const mutateItemView = useMutation({
    mutationFn: (args: {
      addedTags: string[];
      removedTags: string[];
      name: string;
    }) => {
      const addedTags = args.addedTags.map((tag) => {
        const literal = {
          id: tag,
          action: "add",
        };
        return literal;
      });
      const removedTags = args.removedTags.map((tag) => {
        const literal = {
          id: tag,
          action: "remove",
        };
        return literal;
      });
      return changeTags([...addedTags, ...removedTags], args.name);
    },

    onSuccess: (modifiedBook: itemViewPropsType) => {
      queryClient.setQueryData(
        ["books", ...(props.queryData || "")],
        (prevBooks: reqBodyType): reqBodyType => {
          const newData = prevBooks.data.map((book) => {
            return book.title === modifiedBook.title
              ? { ...book, tags: modifiedBook.tags }
              : book;
          });
          return { ...prevBooks, data: newData };
        }
      );
      setIsSaved(true);
    },
  });
  const mutateMultiTager = useMutation({
    mutationFn: (args: {
      addedTags: string[];
      removedTags: string[];
      data: string[];
    }) => {
      const addedTags = args.addedTags.map((tag) => {
        const literal = {
          id: tag,
          action: "add",
        };
        return literal;
      });
      const removedTags = args.removedTags.map((tag) => {
        const literal = {
          id: tag,
          action: "remove",
        };
        return literal;
      });
      return multiChangeTags([...addedTags, ...removedTags], args.data);
    },
    onSuccess: (modifiedBook: onlyPathAndTagsType[]) => {
      queryClient.setQueryData(
        [...(props.queryData || "")],
        (prevBooks: onlyPathAndTagsType[]): onlyPathAndTagsType[] => {
          const newData = prevBooks.map((book) => ({
            ...book,
            tags:
              modifiedBook.find((b) => (b.fullpath = book.fullpath))?.tags ||
              book.tags,
          }));
          return newData;
        }
      );
      setIsSaved(true);
    },
  });
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
                tag.name.toLowerCase() != "unclassified" &&
                (!props.isMultiTag
                  ? tag.name.toLowerCase() != "favorite"
                  : true) && (
                  <div key={tag.id}>
                    <label className="flex items-center gap-2">
                      <Checkbox.Root
                        id={tag.id}
                        onClick={() => onChangeHandler(tag.id)}
                        checked={cBoxes.includes(tag.id)}
                        variant={"subtle"}
                      >
                        <Checkbox.Control />
                        <Checkbox.Label height={"30px"} width={"80px"}>
                          <Box
                            maxWidth="100px"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                          >
                            {tag.name}
                          </Box>
                        </Checkbox.Label>
                      </Checkbox.Root>
                    </label>
                  </div>
                )
            )}
        </Stack>
        <Button variant={"outline"} type="submit">
          Save
        </Button>
        {isSaved && <h1 className="bg-green-300">saved</h1>}
      </form>
    </Stack>
  );
}
