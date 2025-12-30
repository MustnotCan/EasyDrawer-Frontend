import { createContext } from "react";
import { bookmarkWithIdType } from "../../../types/types";

export type bookmarkContextType = {
  bookmarks: bookmarkWithIdType[];
  setBookmarks: (bookmarks: bookmarkWithIdType[]) => void;
  removeBookmark: (bookmarkId: string) => void;
};
export const bookmarkContext = createContext<bookmarkContextType>({
  bookmarks: [],
  setBookmarks: () => {},
  removeBookmark: () => {},
});
