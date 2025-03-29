import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent } from "react";
import { addTag } from "../../../utils/queries/tagsApi";
import { useRevalidator } from "react-router-dom";

export default function AddTag() {
  const queryClient = useQueryClient();
  const { revalidate } = useRevalidator();
  const { mutate } = useMutation({
    mutationFn: (tag: { name: string }) => addTag(tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      revalidate();
    },
    onError: (err) => {
      console.error("Error adding tag:", err);
    },
  });
  const addTagFormAction = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fData = new FormData(e.currentTarget);
    const toAddTag = fData.get("input");
    mutate({ name: toAddTag?.toString() || "" });
    e.currentTarget.reset();
  };
  return (
    <form method="post" onSubmit={addTagFormAction}>
      <input name="input" placeholder="add a tag" />
      <button type="submit">Add</button>
    </form>
  );
}
