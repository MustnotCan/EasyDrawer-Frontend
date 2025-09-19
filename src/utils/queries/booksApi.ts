import {
  itemViewPropsType,
  orderByType,
  selectedItemType,
  taggedTagsType,
} from "@/types/types.ts";
import { BOOKS_URL } from "../envVar.ts";
import {
  changedTagsResponseSchema,
  itemViewPropsSchema,
  multiTaggerFilePropsSchema,
  onlyPathAndTagsSchema,
  reqBodySchema,
  returnedFilesSchema,
} from "../../types/schemas.ts";
import z from "zod";

export async function getBooks(props: {
  spt: number;
  spp: number;
  tfb: string[];
  searchName: string;
  isAnd: boolean;
  orderBy: orderByType;
}) {
  const response = await fetch(
    BOOKS_URL +
      `?take=${props.spt}&pn=${props.spp}&searchName=${props.searchName}&tags=${props.tfb}&isAnd=${props.isAnd}&oB=${props.orderBy.criteria}&direction=${props.orderBy.direction}`
  );
  const body = (await response.json()) as object;

  const parsedBody = reqBodySchema.parse(body);

  return {
    ...parsedBody,
    data: parsedBody.data.map((iv) => itemViewPropsSchema.parse(iv)),
  };
}

export async function changeTags(
  changedTags: taggedTagsType[],
  bookName: string
) {
  const body = { tags: changedTags, title: bookName };
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

export async function getFilesInDir(props: { dirs: string[] }) {
  try {
    const dirs = props.dirs;
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
      "Error happened while getting files in :" + `${props.dirs.join("/")}`
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
export async function multiDelete(props: { data: string[] }) {
  try {
    return await fetch(BOOKS_URL + "multiTagger", {
      method: "DELETE",
      body: JSON.stringify({
        files: props.data,
      }),
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    if (e != null) {
      console.log("Error while removing books with Name :", e);
    }
  }
}

export async function importFiles(props: { dir: string; files: File[] }) {
  const formData = new FormData();
  props.files.forEach((file) => {
    formData.append("files", file, file.name);
    if (file.webkitRelativePath && file.webkitRelativePath != "")
      formData.append("paths", file.webkitRelativePath);
  });
  formData.append("dir", props.dir);
  const untypedResponse = await (
    await fetch(BOOKS_URL + "multiTagger/importfile", {
      body: formData,
      method: "POST",
    })
  ).json();
  const response = z.array(multiTaggerFilePropsSchema).parse(untypedResponse);
  return response;
}
export async function multiMove(props: { data: string[]; newPath: string }) {
  try {
    const untypedResponse: itemViewPropsType[] = await (
      await fetch(BOOKS_URL + "multiTagger/moveFiles", {
        method: "PATCH",
        body: JSON.stringify({
          files: props.data,
          newPath: props.newPath,
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
