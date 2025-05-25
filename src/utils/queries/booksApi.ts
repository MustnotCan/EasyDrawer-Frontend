import { taggedTags } from "@/types/types.ts";
import {
  assertBookHaveProperties,
  assertIsItemView,
  assertResponseHaveProperties,
} from "../asserts/bookAsserts";
import { BOOKS_URL } from "../envVar.ts";

export async function getBooks(data: {
  spt: number;
  spp: number;
  tfb: string[];
  searchName: string;
}) {
  const response = await fetch(
    BOOKS_URL +
      `?take=${data.spt}&pn=${data.spp}&searchName=${data.searchName}&tags=${data.tfb}`
  );

  const body = (await response.json()) as object;
  assertBookHaveProperties(body);
  body.data?.forEach((iv) => assertIsItemView(iv));
  return body;
}

export async function changeTags(changedTags: taggedTags[], bookName: string) {
  const body = { tags: changedTags, title: bookName };
  const response = await (
    await fetch(BOOKS_URL, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    })
  ).json();
  assertIsItemView(response);
  return response;
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

export async function getFilesInDir(props: {
  dirs: string[];
  pn: number;
  take: number;
}) {
  try {
    const dirs = props.dirs;
    const response = await (
      await fetch(
        BOOKS_URL +
          `multiTagger/${encodeURIComponent(dirs.join("/"))}?pn=${
            props.pn
          }&take=${props.take}`
      )
    ).json();
    console.log(response);
    assertResponseHaveProperties(response);

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
