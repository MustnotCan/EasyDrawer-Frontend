import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBookBookmarks,
  removeBookBookmark,
  saveBookBookmarks,
} from "../queries/booksApi";
import { bookmarkWithIdType } from "../../types/types";

export function useBookmarks(args: { bookId: string }) {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ["bookmarks", args.bookId],
    queryFn: (query) => getBookBookmarks({ bookId: query.queryKey[1] }),
  });
  const setBookmarksMutation = useMutation({
    mutationFn: (args: { bookId: string; bookmarks: bookmarkWithIdType[] }) => {
      return saveBookBookmarks({
        bookId: args.bookId,
        bookmarks: args.bookmarks,
      });
    },
    onSuccess(savedBookmarks: bookmarkWithIdType[]) {
      queryClient.setQueryData(
        ["bookmarks", args.bookId],
        (prev: bookmarkWithIdType[]) => {
          savedBookmarks.forEach((sb) => {
            const index = prev.findIndex((bk) => bk.id == sb.id);
            if (index != -1) {
              prev[index] = sb;
            } else {
              prev.push(sb);
            }
          });
        }
      );
    },
  });
  const removeBookmarkMutation = useMutation({
    mutationFn: (args: { bookmarkId: string }) => {
      return removeBookBookmark({ bookmarkId: args.bookmarkId });
    },
    onSuccess(removedBookmark: bookmarkWithIdType) {
      queryClient.setQueryData(
        ["bookmarks", args.bookId],
        (prev: bookmarkWithIdType[]) =>
          prev.filter((bk) => bk.id != removedBookmark.id)
      );
    },
  });
  return {
    data: result.data,
    setBookmarksMutation: setBookmarksMutation.mutate,
    removeBookmarkMutation: removeBookmarkMutation.mutate,
  };
}
