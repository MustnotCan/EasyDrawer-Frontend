import { itemViewProps } from "../../components/CC/CC1/CC/CC1/ItemView";
import { tagType } from "./tagsApi";
export async function getBooks(url: Request) {
  const Url = new URL(url.url);
  const spt = Url.searchParams.get("take") || "";
  const spp = Url.searchParams.get("pn") || "";
  const response = await fetch(
    import.meta.env.VITE_API_MAIN + `?take=${spt}&pn=${spp}`
  );
  const body = (await response.json()) as object;
  assertHaveProperties(body);
  body.data?.forEach((iv) => assertIsItemView(iv));
  return body;
}
/*export function assertHaveCount(rq: unknown): asserts rq is { count: number } {
  if (typeof rq !== "object" || rq === null) {
    throw new Error("rq must be a non-null object");
  }
  if (!("count" in rq) || typeof rq.count !== "number") {
    throw new Error("rq does not have a valid count");
  }
}*/
export type reqBody = { data: []; count: number; take: number; pn: number };
export function assertHaveProperties(body: object): asserts body is reqBody {
  if (!("count" in body) || typeof body.count !== "number") {
    throw new Error("body does not have a valid count");
  }
  if (!("data" in body) || typeof body.data !== "object") {
    throw new Error("body does not have a valid data");
  }
  if (!("take" in body) || typeof body.take !== "number") {
    throw new Error("body does not have a valid take");
  }
  if (!("pn" in body) || typeof body.pn !== "number") {
    throw new Error("body does not have a valid pn");
  }
}
export function assertIsItemView(iv: unknown): asserts iv is itemViewProps {
  if (typeof iv !== "object" || iv === null) {
    throw new Error("iv must be a non-null object");
  }
  if (!("title" in iv) || typeof iv.title !== "string") {
    throw new Error("iv does not have a valid title");
  }
  if (!("thumbnail" in iv) || typeof iv.thumbnail !== "string") {
    throw new Error("iv does not have a valid thumbnailPath");
  }
  if (!("path" in iv) || typeof iv.path !== "string") {
    throw new Error("iv does not have a valid path");
  }
  if (!("tags" in iv) || typeof iv.tags !== "object") {
    throw new Error("iv does not have a valid tags");
  }
}
export function assertIsItemViewWithoutThumbnail(
  iv: unknown
): asserts iv is { title: string; id: string; path: string; tags: tagType[] } {
  if (typeof iv !== "object" || iv === null) {
    throw new Error("iv must be a non-null object");
  }
  if (!("title" in iv) || typeof iv.title !== "string") {
    throw new Error("iv does not have a valid title");
  }
  if (!("id" in iv) || typeof iv.id !== "string") {
    throw new Error("iv does not have a valid id");
  }
  if (!("path" in iv) || typeof iv.path !== "string") {
    throw new Error("iv does not have a valid path");
  }
  if (!("tags" in iv) || typeof iv.tags !== "object") {
    throw new Error("iv does not have a valid tags");
  }
}
export async function addTagsToBook(tagsIds: string[], bookName: string) {
  const body = { tags: tagsIds, title: bookName };
  try {
    const response = (await (
      await fetch(import.meta.env.VITE_API_MAIN + "addTags", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })
    ).json()) as [];
    response.map((bk) => assertIsItemViewWithoutThumbnail(bk));
    return response as itemViewProps[];
  } catch (e) {
    if (e != null) {
      console.log("Error while adding tags to book", e);
    }
  }
}
export async function removeTagsFromBook(tagsIds: string[], bookName: string) {
  const body = { tags: tagsIds, title: bookName };
  try {
    return await fetch(import.meta.env.VITE_API_MAIN + "removeTags", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    if (e != null) {
      console.log("Error while removing tags to book", e);
    }
  }
}
