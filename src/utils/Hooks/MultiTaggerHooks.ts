import {
  onlyPathAndTagsType,
  multiTaggerQueryDataType,
  multiTaggerFilePropsType,
} from "../../types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { multiChangeTags } from "../queries/booksApi";

export function useMultiTaggerBookTagsMutation(
  queryData: multiTaggerQueryDataType ,
  setIsSaved: React.Dispatch<React.SetStateAction<boolean>>
) {
  const queryClient = useQueryClient();
  const mutateMultiTager = useMutation({
    mutationFn: (args: {
      addedTags: string[];
      removedTags: string[];
      data: string[];
      isItemView?: boolean;
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
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setIsSaved(true);
    },
  });

  return mutateMultiTager;
}
export function useMultiTaggerImport() {
  const queryClient = useQueryClient();
  const updateCache = (args: multiTaggerFilePropsType) => {
    const dirs = args.path != "/" ? args.path.split("/") : [""];
    if (dirs.length == 1) {
      queryClient.setQueryData(
        ["Dirs&files", dirs],
        (prev: (multiTaggerFilePropsType | string)[]) => {
          if (
            prev.filter((i) => typeof i != "string" && i.title == args.title)
              .length == 0
          ) {
            return [...prev, args];
          }
        }
      );
    } else {
      for (let i = 1; i < dirs.length + 1; i++) {
        const dirCache = queryClient.getQueryData([
          "Dirs&files",
          dirs.slice(0, i),
        ]) as (multiTaggerFilePropsType | string)[];
        if (!dirCache) break;
        if (dirs.length > i) {
          if (!dirCache.includes(dirs[i]))
            queryClient.setQueryData(
              ["Dirs&files", dirs.slice(0, i)],
              (prev: (multiTaggerFilePropsType | string)[]) => [
                ...prev,
                dirs[i],
              ]
            );
        } else {
          queryClient.setQueryData(
            ["Dirs&files", dirs],
            (prev: (multiTaggerFilePropsType | string)[]) => {
              if (
                prev.filter(
                  (i) => typeof i != "string" && i.title == args.title
                ).length == 0
              ) {
                return [...prev, args];
              }
            }
          );
        }
      }
    }
  };
  return updateCache;
}
