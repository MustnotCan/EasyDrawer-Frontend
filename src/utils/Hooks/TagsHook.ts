import { tagType } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";

export function useTags() {
  const queryClient = useQueryClient();
  const tags = queryClient.getQueryData(["tags"]) as tagType[];
  return tags;
}
