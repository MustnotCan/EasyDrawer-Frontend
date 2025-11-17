import { useMutation, useQuery } from "@tanstack/react-query";
import { addIndex, getIndexes, removeIndex } from "../queries/meiliSearchApi";
import { indexTag } from "../queries/booksApi";

export function useIndexes() {
  const indexes = useQuery({ queryKey: ["indexes"], queryFn: getIndexes });
  return indexes;
}
export function useIndexTag() {
  const { mutate } = useMutation({
    mutationFn: (args: { tag: string; index: string }) => {
      return indexTag({ index: args.index, tag: args.tag });
    },
  });
  return mutate;
}

export function useDeleteIndex() {
  const { mutate } = useMutation({
    mutationFn: (args: { name: string }) => {
      return removeIndex({ index: args.name });
    },
  });
  return mutate;
}
export function useAddIndex() {
  const { mutate } = useMutation({
    mutationFn: (index: { name: string }) => addIndex({ index: index.name }),
    onError: (err) => {
      console.error("Error adding tag:", err);
    },
  });
  return mutate;
}


