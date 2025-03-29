export async function getTags() {
  const response = (await (
    await fetch(import.meta.env.VITE_API_TAGS)
  ).json()) as [];
  response.forEach((tag) => assertHaveProperties(tag));
  return response;
}
export type tagType = { id: string; name: string };

export function assertHaveProperties(tag: unknown): asserts tag is tagType {
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
}
export async function addTag(tag: { name: string }) {
  const response = await fetch(import.meta.env.VITE_API_TAGS + "addTag", {
    method: "POST",
    body: JSON.stringify(tag),
    headers: { "Content-Type": "application/json" },
  });
  const body = (await response.json()) as unknown;
  assertHaveProperties(body);
  return body;
}
export async function removeTag(tag: { name: string }) {
  const response = await fetch(import.meta.env.VITE_API_TAGS + "removeTag", {
    method: "POST",
    body: JSON.stringify(tag),
    headers: { "Content-Type": "application/json" },
  });
  const body = (await response.json()) as unknown;
  assertHaveProperties(body);
  return body;
}
