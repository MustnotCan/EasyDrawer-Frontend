import {
  bookmarkWithIdType,
  itemViewPropsType,
  orderByType,
  selectedItemType,
  taggedTagsType,
} from "@/types/types.ts";
import { BOOKS_URL, VITE_API_MAIN } from "../envVar.ts";
import {
  changedTagsResponseSchema,
  itemViewPropsSchema,
  itemViewSelectedSchema,
  multiTaggerFilePropsSchema,
  onlyPathAndTagsSchema,
  reqBodySchema,
  returnedFilesSchema,
} from "../../types/schemas.ts";
import z from "zod";
import { type PdfAnnotationObject } from "@embedpdf/models";

export async function getBooks(args: {
  spt: number;
  spp: number;
  tfb: string[];
  searchName: string;
  isAnd: boolean;
  orderBy: orderByType;
}) {
  const response = await fetch(
    BOOKS_URL +
      `?take=${args.spt}&pn=${args.spp}&searchName=${args.searchName}&tags=${args.tfb}&isAnd=${args.isAnd}&oB=${args.orderBy.criteria}&direction=${args.orderBy.direction}`
  );
  const body = (await response.json()) as object;

  const parsedBody = reqBodySchema.parse(body);

  return {
    ...parsedBody,
    data: parsedBody.data.map((iv) => itemViewPropsSchema.parse(iv)),
  };
}
export async function getBooksDetails(args: { files: string[] }) {
  const response = await fetch(BOOKS_URL, {
    method: "POST",
    body: JSON.stringify({ files: args.files }),
    headers: { "Content-Type": "application/json" },
  });
  return response;
}
export async function changeTags(changedTags: taggedTagsType[], path: string) {
  const body = { tags: changedTags, path: path };
  const response = await (
    await fetch(BOOKS_URL, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    })
  ).json();
  return changedTagsResponseSchema.parse(response);
}

export async function removeBookById(BookId: string) {
  try {
    return await fetch(BOOKS_URL + BookId, {
      method: "DELETE",
    });
  } catch (e) {
    if (e != null) {
      console.log("Error while removing a book by id", e);
    }
  }
}
export async function removeBookByName(bookName: string) {
  try {
    return await fetch(BOOKS_URL + "bulkdelete", {
      method: "DELETE",
      body: JSON.stringify({ title: bookName }),
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    if (e != null) {
      console.log("Error while removing books with Name :", e);
    }
  }
}

export async function getFilesInDir(args: { dirs: string[] }) {
  try {
    const dirs = args.dirs;
    const untypedResponse = await (
      await fetch(
        BOOKS_URL + `multiTagger/${encodeURIComponent(dirs.join("/"))}`
      )
    ).json();
    const response = returnedFilesSchema.parse(untypedResponse);
    return [
      ...response.dirs.map((dir) =>
        dir.replace(dir.slice(0, dir.lastIndexOf("/") + 1), "")
      ),
      ...response.files,
    ];
  } catch {
    console.log(
      "Error happened while getting files in :" + `${args.dirs.join("/")}`
    );
  }
}
export async function downloadingBook(url: string, fileName: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const tempLink = document.createElement("a");
    tempLink.href = blobUrl;
    tempLink.download = fileName;
    tempLink.dispatchEvent(new MouseEvent("click"));
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
}
export async function getSelectedFilesDetails(args: {
  selected: selectedItemType[];
  unselected: selectedItemType[];
}) {
  try {
    const untypedResponse = await (
      await fetch(BOOKS_URL + `multiTagger/tags`, {
        method: "POST",
        body: JSON.stringify({
          selected: args.selected.map((s) => s.path),
          unselected: args.unselected.map((s) => s.path),
        }),
        headers: { "Content-Type": "application/json" },
      })
    ).json();
    const response = z.array(onlyPathAndTagsSchema).parse(untypedResponse);
    return response;
  } catch (e) {
    console.log(e);
  }
}
export async function getSelectedFilesDetailsItemView(args: {
  selected: selectedItemType[];
}) {
  try {
    const untypedResponse = await (
      await fetch(BOOKS_URL + `bulk`, {
        method: "POST",
        body: JSON.stringify({
          selected: args.selected.map((s) => s.path),
        }),
        headers: { "Content-Type": "application/json" },
      })
    ).json();
    const response = z.array(itemViewSelectedSchema).parse(untypedResponse);
    return response;
  } catch (e) {
    console.log(e);
  }
}
export async function multiChangeTags(
  changedTags: taggedTagsType[],
  booksNames: string[]
) {
  const body = { tags: changedTags, titles: booksNames };
  const untypedResponse = await (
    await fetch(BOOKS_URL + "multiTagger/updatetags", {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    })
  ).json();
  const response = z.array(onlyPathAndTagsSchema).parse(untypedResponse);
  return response;
}
export async function multiDelete(args: { data: string[] }) {
  try {
    return await fetch(BOOKS_URL + "multiTagger", {
      method: "DELETE",
      body: JSON.stringify({
        files: args.data,
      }),
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    if (e != null) {
      console.log("Error while removing books with Name :", e);
    }
  }
}

export async function importFiles(args: { dir: string; files: File[] }) {
  const formData = new FormData();
  args.files.forEach((file) => {
    formData.append("files", file, file.name);
    if (file.webkitRelativePath && file.webkitRelativePath != "")
      formData.append("paths", file.webkitRelativePath);
  });
  formData.append("dir", args.dir);
  const untypedResponse = await (
    await fetch(BOOKS_URL + "multiTagger/importfile", {
      body: formData,
      method: "POST",
    })
  ).json();
  const response = untypedResponse;
  return response;
}
export async function multiMove(args: { data: string[]; newPath: string }) {
  try {
    const untypedResponse: itemViewPropsType[] = await (
      await fetch(BOOKS_URL + "multiTagger/moveFiles", {
        method: "PATCH",
        body: JSON.stringify({
          files: args.data,
          newPath: args.newPath,
        }),
        headers: { "Content-Type": "application/json" },
      })
    ).json();

    const response = z.array(multiTaggerFilePropsSchema).parse(untypedResponse);

    return response;
  } catch (e) {
    if (e != null) {
      console.log("Error while moving books :", e);
    }
    return [];
  }
}

export async function indexTag(args: { tag: string; index: string }) {
  try {
    const response = await fetch(VITE_API_MAIN + "tag/index", {
      method: "POST",
      body: JSON.stringify({ tag: args.tag, index: args.index }),
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
}

export async function removeBooksWithTag(tag: string) {
  try {
    const response = await fetch(BOOKS_URL + "tag/" + tag, {
      method: "DELETE",
    });
    return response;
  } catch (e) {
    console.error(e);
  }
}
export async function saveBookAnnotations(args: {
  bookId: string;
  annotations: { annotation: PdfAnnotationObject; status: string }[];
}) {
  try {
    const response = await fetch(BOOKS_URL + "annotation", {
      method: "POST",
      body: JSON.stringify({
        bookId: args.bookId,
        annotations: args.annotations,
      }),
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (e) {
    console.log(e);
  }
}
export async function getBookAnnotations(args: { bookId: string }) {
  try {
    const response = await fetch(BOOKS_URL + "annotation/" + args.bookId);
    return await response.json();
  } catch (e) {
    console.log(e);
  }
}
export async function saveBookBookmarks(args: {
  bookId: string;
  bookmarks: bookmarkWithIdType[];
}) {
  try {
    const response = await fetch(BOOKS_URL + "bookmark", {
      method: "POST",
      body: JSON.stringify({
        bookId: args.bookId,
        bookmarks: args.bookmarks,
      }),
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (e) {
    console.log(e);
  }
}
export async function getBookBookmarks(args: { bookId: string }) {
  try {
    const response = await fetch(BOOKS_URL + "bookmark/" + args.bookId);
    return await response.json();
  } catch (e) {
    console.log(e);
  }
}
export async function removeBookBookmark(args: { bookmarkId: string }) {
  try {
    const response = await fetch(BOOKS_URL + "bookmark/" + args.bookmarkId, {
      method: "DELETE",
    });
    return await response.json();
  } catch (e) {
    console.log(e);
  }
}
