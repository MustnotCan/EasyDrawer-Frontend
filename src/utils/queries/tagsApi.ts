import { TAGS_URL } from "../envVar";
import { tagSchema, tagWithCountSchema } from "../../types/schemas";
export async function getTags() {
  const response = (await (await fetch(TAGS_URL)).json()) as [];
  return response.map((tag) => tagWithCountSchema.parse(tag));
}

export async function addTag(tag: { name: string }) {
  const response = await fetch(TAGS_URL, {
    method: "POST",
    body: JSON.stringify(tag),
    headers: { "Content-Type": "application/json" },
  });
  const body = (await response.json()) as unknown;
  return tagSchema.parse(body);
}
export async function removeTag(tag: { name: string }) {
  const response = await fetch(TAGS_URL, {
    method: "DELETE",
    body: JSON.stringify(tag),
    headers: { "Content-Type": "application/json" },
  });
  const body = (await response.json()) as unknown;
  return tagSchema.parse(body);
}
export async function renameTag(prop: { prevName: string; newName: string }) {
  const response = await fetch(TAGS_URL, {
    method: "PATCH",
    body: JSON.stringify({
      body: { prevTagName: prop.prevName, newTagName: prop.newName },
    }),
    headers: { "Content-Type": "application/json" },
  });
  const body = (await response.json()) as unknown;
  return tagSchema.parse(body);
}
