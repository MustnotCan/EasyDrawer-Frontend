import { tagType } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTag } from "../queries/tagsApi";

export function useMutateTags() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (tag: { name: string }) => addTag(tag),
    onSuccess: (newTag: tagType) => {
      queryClient.setQueryData(["tags"], (oldTags: tagType[]) => {
        if (!oldTags) return [];
        if (oldTags.map((tg) => tg.name).includes(newTag.name)) return oldTags;
        else return [...oldTags, { ...newTag, booksCount: 0 }];
      });
    },
    onError: (err) => {
      console.error("Error adding tag:", err);
    },
  });
  return mutate;
}
