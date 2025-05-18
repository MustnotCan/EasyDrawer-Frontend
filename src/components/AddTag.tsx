import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent } from "react";
import { addTag } from "../utils/queries/tagsApi";
import { useCallback } from "react";
import { Button, Input, Stack } from "@chakra-ui/react";
import { tagType } from "@/types/types";

export default function AddTag() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (tag: { name: string }) => addTag(tag),
    onSuccess: (newTag: tagType) => {
      queryClient.setQueryData(["tags"], (oldTags: tagType[]) => {
        if (!oldTags) return [];
        return [...oldTags, newTag];
      });
    },
    onError: (err) => {
      console.error("Error adding tag:", err);
    },
  });
  const addTagFormAction = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fData = new FormData(e.currentTarget);
      const toAddTag = fData.get("input")?.toString();
      if (toAddTag && toAddTag.length > 0) {
        mutate({
          name: toAddTag.slice(0, 1).toUpperCase() + toAddTag.slice(1),
        });
        e.currentTarget.reset();
      }
    },
    [mutate]
  );
  return (
    <form method="post" onSubmit={addTagFormAction}>
      <Stack direction={"column"}>
        <Input name="input" placeholder="Tag name" required />
        <Button type="submit" variant={"outline"} alignSelf={"start"}>
          Add
        </Button>
      </Stack>
    </form>
  );
}
