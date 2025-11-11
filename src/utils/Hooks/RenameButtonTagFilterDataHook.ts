import { tagType } from "@/types/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { renameTag } from "../queries/tagsApi";

export function useTags(tagName: string) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (newName: string) =>
      renameTag({ prevName: tagName, newName: newName }),
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
