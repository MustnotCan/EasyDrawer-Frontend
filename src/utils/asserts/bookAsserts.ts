import {
  itemViewProps,
  itemViewPropsWithoutTags,
  onlyPathAndTags,
  reqBody,
} from "../../types/types";
import { assertTagHaveProperties } from "./tagAsserts";

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
export function assertIsItemViewWithoutTags(
  iv: unknown
): asserts iv is itemViewPropsWithoutTags {
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
export function assertIsItemViewWithoutTagsArray(
  iv: unknown
): asserts iv is itemViewProps[] {
  try {
    if (typeof iv !== "object" || iv === null) {
      throw new Error("response must be a non-null object");
    }
    if (!Array.isArray(iv)) {
      throw new Error("iv Should be an array");
    }
    for (const file of iv) {
      try {
        assertIsItemViewWithoutTags(file);
      } catch {
        console.log("Some item is not a valid ItemView ");
      }
    }
  } catch (e) {
    console.error("error happened: ", e);
  }
}

export function assertIsItemViewArray(
  iv: unknown
): asserts iv is itemViewProps[] {
  try {
    if (typeof iv !== "object" || iv === null) {
      throw new Error("response must be a non-null object");
    }
    if (!Array.isArray(iv)) {
      throw new Error("iv Should be an array");
    }
    for (const file of iv) {
      try {
        assertIsItemView(file);
      } catch {
        console.log("Some item is not a valid ItemView ");
      }
    }
  } catch (e) {
    console.error("error happened: ", e);
  }
}
export function assertResponseHaveProperties(
  response: unknown
): asserts response is { dirs: string[]; files: itemViewProps[] } {
  try {
    if (typeof response !== "object" || response === null) {
      throw new Error("response must be a non-null object");
    }
    if (!("dirs" in response) || !Array.isArray(response.dirs)) {
      throw new Error("response does not have a valid dirs object");
    }
    if (!("files" in response) || typeof response.files !== "object") {
      throw new Error("response does not have a valid files object");
    }
    if (!Array.isArray(response.files)) {
      throw new Error("files Should be an array");
    }
    for (const file of response.files) {
      try {
        assertIsItemView(file);
      } catch {
        console.log("Some item is not a valid ItemView in Multi tagger");
      }
    }
  } catch (e) {
    console.error("error happened: ", e);
  }
}
function assertIsPathAndTag(item: unknown): asserts item is onlyPathAndTags {
  try {
    if (typeof item !== "object" || item === null) {
      throw new Error("response must be a non-null object");
    }
    if (
      (!("fullpath" in item) || typeof item.fullpath !== "string") &&
      (!("title" in item) || typeof item.title !== "string")
    ) {
      throw new Error("item does not have a valid fullpath/title");
    }
    if (!("tags" in item) || !Array.isArray(item.tags)) {
      throw new Error("item does not have a valid tags");
    }
    for (const file of item.tags) {
      try {
        assertTagHaveProperties(file);
      } catch {
        console.log("tags should be a string only");
      }
    }
  } catch (e) {
    console.error("error happened: ", e);
  }
}
export function assertResponseIsArrayOfPathAndTags(
  response: unknown
): asserts response is onlyPathAndTags[] {
  try {
    if (typeof response !== "object" || response === null) {
      throw new Error("response must be a non-null object");
    }
    if (!Array.isArray(response)) {
      throw new Error("response Should be an array");
    }
    for (const file of response) {
      try {
        assertIsPathAndTag(file);
      } catch {
        console.log("Some item is not a valid ItemView in Multi tagger");
      }
    }
  } catch (e) {
    console.error("error happened: ", e);
  }
}
export function assertItemViewHasOnlyTagsAndTitles(
  iv: unknown
): asserts iv is itemViewProps {
  try {
    if (typeof iv !== "object" || iv === null) {
      throw new Error("iv must be a non-null object");
    }
    if (!("title" in iv) || typeof iv.title !== "string") {
      throw new Error("iv does not have a valid title");
    }

    if (!("tags" in iv) || typeof iv.tags !== "object") {
      throw new Error("iv does not have a valid tags");
    }
  } catch (e) {
    console.error("error happened: ", e);
  }
}
