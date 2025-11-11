import { tagType, tagWithCountType } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTag, getTags, removeTag, renameTag } from "../queries/tagsApi";

export function useTags() {
  const queryClient = useQueryClient();
  if (queryClient.getQueryData(["tags"]) == undefined) {
    queryClient.fetchQuery({ queryKey: ["tags"], queryFn: getTags });
  }
  const tags = queryClient.getQueryData(["tags"]) as tagWithCountType[];
  return tags;
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (tag: { name: string }) => removeTag(tag),
    onSuccess: (deletedTag: tagType) => {
      queryClient.setQueryData(["tags"], (oldTags: tagType[]) => {
        if (!oldTags) return [];
        return [...oldTags.filter((tag) => tag.name !== deletedTag.name)];
      });
    },
    onError: (err) => {
      console.error("Error removing tag:", err);
    },
  });
  return mutate;
}

export function useRenameTag() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (args: { newName: string; prevName: string }) =>
      renameTag({ prevName: args.prevName, newName: args.newName }),
    onSuccess: (returnedTag: tagType) => {
      queryClient.setQueryData(["tags"], (oldTags: tagType[]) => {
        if (!oldTags) return [];
        return oldTags.map((tag) =>
          tag.id === returnedTag.id ? { ...tag, name: returnedTag.name } : tag
        );
      });
    },
    onError: (err) => {
      console.error("Error renaming tag:", err);
    },
  });
  return mutate;
}
export function useAddTag() {
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
