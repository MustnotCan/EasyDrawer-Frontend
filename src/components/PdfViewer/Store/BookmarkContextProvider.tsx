import { bookmarkWithIdType } from "../../../types/types";
import { ReactElement, useState } from "react";
import { bookmarkContext, bookmarkContextType } from "./BookmarkContext";
import { useBookmarks } from "../../../utils/Hooks/BookmarkHook";
import { useActiveDocument } from "@embedpdf/plugin-document-manager/react";
export default function BookmarkContextProvider(props: {
  children: ReactElement;
}) {
  const { activeDocumentId } = useActiveDocument();
  const { data, setBookmarksMutation, removeBookmarkMutation } = useBookmarks({
    bookId: activeDocumentId!,
  });
  const setBookmarks = (bookmarks: bookmarkWithIdType[]) => {
    setBookmarksMutation({
      bookId: activeDocumentId!,
      bookmarks: bookmarks,
    });
  };
  const removeBookmark = (bookmarkId: string) => {
    removeBookmarkMutation({ bookmarkId: bookmarkId });
  };

  const [activeParent, setActiveParent] = useState<string | null>(null);

  const BookmarkContextValue: bookmarkContextType = {
    bookmarks: data,
    setBookmarks: setBookmarks,
    removeBookmark: removeBookmark,
    activeParent: activeParent,
    setActiveParent: setActiveParent,
  };
  return (
    <bookmarkContext.Provider value={BookmarkContextValue}>
      {props.children}
    </bookmarkContext.Provider>
  );
}
