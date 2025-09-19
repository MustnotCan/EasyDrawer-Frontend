import {
  changedTagsResponseType,
  listItemViewQueryDataType,
  reqBodyType,
  tagType,
} from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeTags } from "../queries/booksApi";

export function useItemViewChangeTagsMutation(
  queryData: listItemViewQueryDataType,
  tags: tagType[]
) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (args: { isFavorite: boolean; name: string }) => {
      const literal = {
        id: tags.filter((tag) => tag.name == "favorite")[0].id,
        action: args.isFavorite ? "remove" : "add",
      };
      return changeTags([literal], args.name);
    },
    onSuccess: (modifiedBook: changedTagsResponseType) => {
      queryClient.setQueryData(
        ["books", ...queryData],
        (prevBooks: reqBodyType): reqBodyType => {
          const newData = prevBooks.data.map((book) => {
            return book.title === modifiedBook.title
              ? { ...book, tags: modifiedBook.tags }
              : book;
          });
          return { ...prevBooks, data: newData };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["tags"] });
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
      name: string;
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
      return changeTags([...addedTags, ...removedTags], args.name);
    },

    onSuccess: (modifiedBook: changedTagsResponseType) => {
      queryClient.setQueryData(
        ["books", ...(queryData || "")],
        (prevBooks: reqBodyType): reqBodyType => {
          // TO DO : Local tags cache update
          /*const previousBookTags = prevBooks.data.find(
            (dt) => dt.title == modifiedBook.title
          )?.tags;
          const addedTags = modifiedBook.tags.filter(
            (tag) => !previousBookTags?.map((tg) => tg.name).includes(tag.name)
          );
          const removedTags =
            previousBookTags?.filter(
              (tag) => !modifiedBook?.tags.includes(tag)
            ) || [];
          if (addedTags) {
            queryClient.setQueryData(
              ["tags"],
              (prevTags: tagWithCountType[]) => {
                console.log("prevTags", prevTags);
                const updatedTags = [...prevTags];

                for (const tag of addedTags) {
                  const foundTag = updatedTags.find(
                    (tg) => tg.name == tag.name
                  );

                  if (foundTag && foundTag.booksCount) {
                    foundTag.booksCount += 1;
                  }
                }

                const unmodifiedTags = prevTags.filter(
                  (tg) => !updatedTags.map((tg) => tg.name).includes(tg.name)
                );
                return [...unmodifiedTags, ...updatedTags];
              }
            );
          }*/
          const newData = prevBooks.data.map((book) => {
            return book.title === modifiedBook.title
              ? { ...book, tags: modifiedBook.tags }
              : book;
          });
          return { ...prevBooks, data: newData };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["tags"] });

      setIsSaved(true);
    },
  });
  return mutateItemView;
}
