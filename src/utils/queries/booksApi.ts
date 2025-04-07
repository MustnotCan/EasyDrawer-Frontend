import {
  assertBookHaveProperties,
  assertIsItemView,
} from "../asserts/bookAsserts";
export async function getBooks(data: {
  spt: number;
  spp: number;
  tfb: string[];
  searchName: string;
}) {
  const tfbs = { tags: data.tfb, searchName: data.searchName };
  const response = await fetch(
    import.meta.env.VITE_API_MAIN + `?take=${data.spt}&pn=${data.spp}`,
    {
      body: JSON.stringify(tfbs),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );

  const body = (await response.json()) as object;
  assertBookHaveProperties(body);
  body.data?.forEach((iv) => assertIsItemView(iv));
  return body;
}

export async function addTagsToBook(tagsIds: string[], bookName: string) {
  const body = { tags: tagsIds, title: bookName, action: "add" };
  try {
    (await (
      await fetch(import.meta.env.VITE_API_MAIN, {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })
    ).json()) as [];
  } catch (e) {
    if (e != null) {
      console.log("Error while adding tags to book", e);
    }
  }
}
export async function removeTagsFromBook(tagsIds: string[], bookName: string) {
  const body = { tags: tagsIds, title: bookName, action: "remove" };
  try {
    return await fetch(import.meta.env.VITE_API_MAIN, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    if (e != null) {
      console.log("Error while removing tags to book", e);
    }
  }
}
export async function removeBookById(BookId: string) {
  try {
    return await fetch(import.meta.env.VITE_API_MAIN + BookId, {
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
    return await fetch(import.meta.env.VITE_API_MAIN + "bulkdelete", {
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
