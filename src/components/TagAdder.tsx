import { ChangeEvent, FormEvent, useState } from "react";
import { changeTags } from "../utils/queries/booksApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemViewProps, reqBody, tagAdderProps } from "../types/types";
import { Button, Stack } from "@chakra-ui/react";
export default function TagAdder(props: tagAdderProps) {
  const queryClient = useQueryClient();
  const [cBoxes, setCBoxes] = useState<string[]>(
    props.itemTags.map((iT) => iT.id)
  );
  const [searchInput, setSearchInput] = useState<string>("");
  const [toRemTags, setToRemTags] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (setIsSaved) {
      setIsSaved(false);
    }
    setCBoxes((prevCBoxes) => {
      if (prevCBoxes.includes(e.target.id)) {
        setToRemTags((tRT) => {
          return [...tRT, e.target.id];
        });
        return prevCBoxes.filter((cb) => cb !== e.target.id);
      } else {
        return [...prevCBoxes, e.target.id];
      }
    });
  };

  const { mutate } = useMutation({
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

    onSuccess: (modifiedBook: itemViewProps) => {
      queryClient.setQueryData(
        ["books", ...props.queryData],
        (prevBooks: reqBody): reqBody => {
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
  const formAction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      addedTags: cBoxes,
      removedTags: Array.from(new Set([...toRemTags])),
      name: props.name,
    });
  };
  return (
    <>
      <search>
        Find tag:
        <input
          onChange={(e) => {
            e.stopPropagation();
            setSearchInput(e.target.value);
          }}
        ></input>
      </search>
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
                tag.name.toLowerCase() != "favorite" && (
                  <div key={tag.id}>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={tag.id}
                        onChange={onChangeHandler}
                        checked={cBoxes.includes(tag.id)}
                      />

                      {tag.name}
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
    </>
  );
}
