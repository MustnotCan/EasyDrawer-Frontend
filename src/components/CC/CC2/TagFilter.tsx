import { ChangeEvent, FormEvent, useState } from "react";
import { removeTag, tagType } from "../../../utils/queries/tagsApi.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRevalidator } from "react-router-dom";

export default function TagFilter(props: { tags: tagType[] }) {
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
    console.log(cBoxes);
  };
  const { mutate } = useMutation({
    mutationFn: (tag: { name: string }) => removeTag(tag),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["books"] });
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
              />
              {tag.name}
              <button onClick={() => mutate({ name: tag.name })}>rm</button>
            </label>
          </div>
        ))}
        <button type="submit">Filter</button>
      </form>
    </>
  );
}
