import { itemViewProps, reqBody } from "../../types/types";

export function assertBookHaveProperties(
  body: object
): asserts body is reqBody {
  try {
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
  } catch (e) {
    console.error("error happened: ", e);
  }
}
export function assertIsItemView(iv: unknown): asserts iv is itemViewProps {
  try {
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
    if (!("lastOpened" in iv) || typeof iv.lastOpened !== "string") {
      throw new Error("iv does not have a valid lastOpened");
    }
    if (!("thumbnail" in iv) || typeof iv.thumbnail !== "string") {
      throw new Error("iv does not have a valid thumbnailPath");
    }
  } catch (e) {
    console.error("error happened: ", e);
  }
}
