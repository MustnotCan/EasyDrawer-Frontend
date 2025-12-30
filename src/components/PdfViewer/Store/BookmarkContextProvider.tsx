import { bookmarkWithIdType } from "../../../types/types";
import { ReactElement, useCallback } from "react";
import { bookmarkContext, bookmarkContextType } from "./BookmarkContext";
export default function BookmarkContextProvider(props: {
  children: ReactElement;
  bookmarks: bookmarkWithIdType[];
  setBookmarksMutation: (arg0: {
    bookId: string;
    bookmarks: bookmarkWithIdType[];
  }) => void;
  removeBookmarkMutation: (arg0: { bookmarkId: string }) => void;
  bookId: string;
}) {
  const setBookmarks = useCallback(
    (bookmarks: bookmarkWithIdType[]) => {
      props.setBookmarksMutation({
        bookId: props.bookId,
        bookmarks: bookmarks,
      });
    },
    [props]
  );
  const removeBookmark = useCallback(
    (bookmarkId: string) => {
      props.removeBookmarkMutation({ bookmarkId: bookmarkId });
    },
    [props]
  );
  const BookmarkContextValue: bookmarkContextType = {
    bookmarks: props.bookmarks,
    setBookmarks: setBookmarks,
    removeBookmark: removeBookmark,
  };
  return (
    <bookmarkContext.Provider value={BookmarkContextValue}>
      {props.children}
    </bookmarkContext.Provider>
  );
}
