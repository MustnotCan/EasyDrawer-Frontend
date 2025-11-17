import {
  changedTagsResponseType,
  itemViewSelectedType,
  listItemViewQueryDataType,
  onlyPathAndTagsType,
  reqBodyType,
  tagType,
  tagWithCountType,
} from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeTags, multiChangeTags } from "../queries/booksApi";

export function useItemViewChangeTagsMutation(
  queryData: listItemViewQueryDataType,
  tags: tagType[]
) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (args: { isFavorite: boolean; path: string }) => {
      const literal = {
        id: tags.filter((tag) => tag.name == "favorite")[0].id,
        action: args.isFavorite ? "remove" : "add",
      };
      return changeTags([literal], args.path);
    },
    onSuccess: (modifiedBook: changedTagsResponseType, args) => {
      //console.log("this fired when i clicked the heart icon");
      /*queryClient.setQueryData(
        ["books", ...queryData],
        (prevBooks: reqBodyType): reqBodyType => {
          const newData = prevBooks.data.map((book) => {
            return book.title === modifiedBook.title
              ? { ...book, tags: modifiedBook.tags }
              : book;
          });
          return { ...prevBooks, data: newData };
        }
      );*/
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.setQueryData(["tags"], (prev: tagWithCountType[]) => {
        return prev.map((tag) =>
          tag.name == "favorite"
            ? {
                ...tag,
                booksCount: args.isFavorite
                  ? Number(tag.booksCount) - 1
                  : Number(tag.booksCount) + 1,
              }
            : tag
        );
      });
    },
    onError: (e) => {
      console.log(e);
    },
  });

  return mutate;
}
/**
 *
 * @param queryData
 * @param setIsSaved
 * @returns
 */
export function useItemViewBookTagsMutation(
  queryData: listItemViewQueryDataType,
  setIsSaved: React.Dispatch<React.SetStateAction<boolean>>
) {
  const queryClient = useQueryClient();

  const mutateItemView = useMutation({
    mutationFn: (args: {
      addedTags: string[];
      removedTags: string[];
      path: string;
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
      return changeTags([...addedTags, ...removedTags], args.path);
    },

    onSuccess: (modifiedBook: changedTagsResponseType) => {
      //console.log("this fired when i changed tags from the itemview");
      /*queryClient.setQueryData(
        ["books", ...(queryData || "")],
        (prevBooks: reqBodyType): reqBodyType => {
          const newData = prevBooks.data.map((book) => {
            return book.title === modifiedBook.title
              ? { ...book, tags: modifiedBook.tags }
              : book;
          });
          return { ...prevBooks, data: newData };
        }
      );*/
      queryClient.invalidateQueries({ queryKey: ["books"] });

      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setIsSaved(true);
    },
  });
  return mutateItemView;
}
export function useChangeTagsBarMutation(
  queryData: listItemViewQueryDataType,
  setIsSaved: React.Dispatch<React.SetStateAction<boolean>>
) {
  const queryClient = useQueryClient();
  const mutateItemView = useMutation({
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

    onSuccess: (modifiedBooks: onlyPathAndTagsType[]) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setIsSaved(true);
    },
  });
  return mutateItemView;
}
