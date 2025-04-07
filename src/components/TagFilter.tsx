import { ChangeEvent, FormEvent, useState } from "react";
import { removeTag } from "../utils/queries/tagsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRevalidator } from "react-router-dom";
import { tagType } from "../types/types";
export default function TagFilter(props: {
  tags: tagType[];
  setTFB: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const queryClient = useQueryClient();
  const { revalidate } = useRevalidator();

  const [cBoxes, setCBoxes] = useState<string[]>([]);

  const onChangeHandler = (e: ChangeEvent) => {
    if (cBoxes?.includes(e.target.id)) {
      setCBoxes(cBoxes.filter((cb) => cb != e.target.id));
    } else {
      const box = cBoxes?.concat([e.target.id]);
      setCBoxes(box);
    }
  };
  const formAction = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.setTFB(cBoxes);
  };
  const { mutate } = useMutation({
    mutationFn: (tag: { name: string }) => removeTag(tag),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["tags"] });
      revalidate();
    },
    onError: (err) => {
      console.error("Error removing tag:", err);
    },
  });
  return (
    <>
      <form method="post" onSubmit={formAction} id="tagFilteringForm">
        <label htmlFor="tags">Tags:</label>
        {props.tags.map((tag) => (
          <div key={tag.id}>
            <label>
              <input
                type="checkbox"
                id={tag.name}
                name={tag.name}
                onChange={onChangeHandler}
                checked={cBoxes.includes(tag.name)}
              />
              {tag.name}
              <button onClick={() => mutate({ name: tag.name })}>rm</button>
            </label>
          </div>
        ))}
        <button type="submit">Filter</button>
        <button type="submit" onClick={() => setCBoxes([])}>
          Clear Filters
        </button>
      </form>
    </>
  );
}
