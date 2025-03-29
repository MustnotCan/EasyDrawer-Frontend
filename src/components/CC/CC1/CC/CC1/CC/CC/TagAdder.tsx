import { ChangeEvent, FormEvent, useState } from "react";
import { tagType } from "../../../../../../../utils/queries/tagsApi";
import {
  addTagsToBook,
  removeTagsFromBook,
} from "../../../../../../../utils/queries/booksApi";
import { useRevalidator } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { FileType } from "../../../../../../../types/pdfFile";
export default function TagAdder(props: {
  name: string;
  tags: tagType[];
  itemTags: tagType[];
}) {
  const queryClient = useQueryClient();
  const { revalidate } = useRevalidator();
  const [cBoxes, setCBoxes] = useState<string[]>(
    props.itemTags.map((iT) => iT.id)
  );
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
    const res = await addTagsToBook(cBoxes, props.name);
    queryClient.refetchQueries({ queryKey: ["books"] });
    revalidate();
  };
  return (
    <form method="post" onSubmit={formAction} id="tagAddingForm">
      <label htmlFor="tags">Tags:</label>
      <div style={{ overflow: "scroll", height: 100 }}>
        {props.tags.map((tag) => (
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
  );
}
