import { ChangeEvent, FormEvent, useState } from "react";
import { addTagsToBook, removeTagsFromBook } from "../utils/queries/booksApi";
import { useRevalidator } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { tagAdderProps } from "../types/types";
export default function TagAdder(props: tagAdderProps) {
  const queryClient = useQueryClient();
  const { revalidate } = useRevalidator();
  const [cBoxes, setCBoxes] = useState<string[]>(
    props.itemTags.map((iT) => iT.id)
  );
  const [searchInput, setSearchInput] = useState<string>("");
  const [toRemTags, setToRemTags] = useState<string[]>([]);
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setCBoxes((prevCBoxes) => {
      if (prevCBoxes.includes(e.target.id)) {
        setToRemTags((tRT) => {
          console.log("adding tag", e.target.id);
          return [...tRT, e.target.id];
        });
        return prevCBoxes.filter((cb) => cb !== e.target.id);
      } else {
        return [...prevCBoxes, e.target.id];
      }
    });
  };
  const formAction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    removeTagsFromBook(Array.from(new Set([...toRemTags])), props.name);
    await addTagsToBook(cBoxes, props.name);
    queryClient.refetchQueries({ queryKey: ["books"] });
    revalidate();
    console.log("clicking saving");
  };
  return (
    <>
      <search>
        find tag:
        <input
          onChange={(e) => {
            e.stopPropagation();
            setSearchInput(e.target.value);
          }}
        ></input>
      </search>
      <form method="post" onSubmit={formAction} id="tagAddingForm">
        <label htmlFor="tags">Tags:</label>
        <div style={{ overflow: "scroll", height: 100 }}>
          {props.tags
            .filter((tag) =>
              searchInput != "" ? tag.name.includes(searchInput) : true
            )
            .map((tag) => (
              <div key={tag.id}>
                <label>
                  <input
                    type="checkbox"
                    id={tag.id}
                    onChange={onChangeHandler}
                    checked={cBoxes.includes(tag.id)}
                  />
                  {tag.name}
                </label>
              </div>
            ))}
        </div>
        <button type="submit">Save tags</button>
      </form>
    </>
  );
}
