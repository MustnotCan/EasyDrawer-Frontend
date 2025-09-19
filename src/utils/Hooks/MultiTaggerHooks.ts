import {
  onlyPathAndTagsType,
  multiTaggerQueryDataType,
} from "../../types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { multiChangeTags } from "../queries/booksApi";

export function useMultiTaggerBookTagsMutation(
  queryData: multiTaggerQueryDataType,
  setIsSaved: React.Dispatch<React.SetStateAction<boolean>>
) {
  const queryClient = useQueryClient();
  const mutateMultiTager = useMutation({
    mutationFn: (args: {
      addedTags: string[];
      removedTags: string[];
      data: string[];
    }) => {
      const addedTags = args.addedTags.map((tag) => {
        const literal = {
          id: tag,
          action: "add",
        };
        return literal;
      });
      const removedTags = args.removedTags.map((tag) => {
        const literal = {
          id: tag,
          action: "remove",
        };
        return literal;
      });
      return multiChangeTags([...addedTags, ...removedTags], args.data);
    },
    onSuccess: (modifiedBook: onlyPathAndTagsType[]) => {
      queryClient.setQueryData(
        [...(queryData || "")],
        (prevBooks: onlyPathAndTagsType[]): onlyPathAndTagsType[] => {
          const newData = prevBooks.map((book) => ({
            ...book,
            tags:
              modifiedBook.find((b) => (b.fullpath = book.fullpath))?.tags ||
              book.tags,
          }));
          return newData;
        }
      );

      setIsSaved(true);
    },
  });
  return mutateMultiTager;
}
