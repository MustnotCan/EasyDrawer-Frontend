import { getBooks } from "./booksApi.ts";
import { getTags } from "./tagsApi.ts";

export default async function getData(data: {
  pn: number;
  take: number;
  tfb: string[];
  searchName: string;
}) {
  const tags = await getTags();
  const books = await getBooks({
    spp: data.pn,
    spt: data.take,
    tfb: data.tfb,
    searchName: data.searchName,
  });
  return { books: books, tags: tags };
}
