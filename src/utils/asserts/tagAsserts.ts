import { tagType } from "../../types/types";
export function assertTagHaveProperties(tag: unknown): asserts tag is tagType {
  try {
    if (!(tag != null)) {
      throw new Error("null tag");
    }
    if (!(typeof tag === "object")) {
      throw new Error("tag not an object");
    }
    if (!("id" in tag) || typeof tag.id != "string") {
      throw new Error("id not in tag or not string");
    }
    if (!("name" in tag) || typeof tag.name != "string") {
      throw new Error("name not in tag or not string");
    }
  } catch (e) {
    console.error("error happened: ", e);
  }
}
