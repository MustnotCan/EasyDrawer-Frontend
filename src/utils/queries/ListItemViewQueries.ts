import { getBooks } from "./booksApi.ts";
import { getTags } from "./tagsApi.ts";

export default async function getData(args: { url: Request }) {
  const tags = await getTags();
  const books = await getBooks(args.url);
  return { books: books, tags: tags };
}
