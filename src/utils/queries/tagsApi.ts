import { assertTagHaveProperties } from "../asserts/tagAsserts";
export async function getTags() {
  const response = (await (
    await fetch(import.meta.env.VITE_API_TAGS)
  ).json()) as [];
  response.forEach((tag) => assertTagHaveProperties(tag));
  return response;
}

export async function addTag(tag: { name: string }) {
  const response = await fetch(import.meta.env.VITE_API_TAGS, {
    method: "POST",
    body: JSON.stringify(tag),
    headers: { "Content-Type": "application/json" },
  });
  const body = (await response.json()) as unknown;
  console.log(body);
  assertTagHaveProperties(body);
  return body;
}
export async function removeTag(tag: { name: string }) {
  const response = await fetch(import.meta.env.VITE_API_TAGS, {
    method: "DELETE",
    body: JSON.stringify(tag),
    headers: { "Content-Type": "application/json" },
  });
  const body = (await response.json()) as unknown;
  assertTagHaveProperties(body);
  return body;
}
export async function renameTag(prop: { prevName: string; newName: string }) {
  const response = await fetch(import.meta.env.VITE_API_TAGS, {
    method: "PATCH",
    body: JSON.stringify({
      body: { prevTagName: prop.prevName, newTagName: prop.newName },
    }),
    headers: { "Content-Type": "application/json" },
  });
  const body = (await response.json()) as unknown;
  assertTagHaveProperties(body);
  return body;
}
