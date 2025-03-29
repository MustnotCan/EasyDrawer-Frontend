import { reqBody } from "../utils/queries/booksApi";
import { tagType } from "../utils/queries/tagsApi";
import ListItemView from "./CC/CC1/ListItemView";
import ItemSize from "./CC/CC3/ItemSize";
import TagFilter from "./CC/CC2/TagFilter";
import Paginator from "./CC/CC4/Paginator";
import AddTag from "./CC/CC2/AddTag";
import type { Route } from "../../.react-router/types/src/+types/root";
import getData from "../utils/queries/ListItemViewQueries";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  console.log("loader executing", request);
  return await queryClient.fetchQuery({
    queryKey: ["books"],
    queryFn: () => getData({ url: request }),
  });
}

export default function View({ loaderData }: Route.ComponentProps) {
  const data: { books: reqBody; tags: tagType[] } = loaderData as unknown as {
    books: reqBody;
    tags: tagType[];
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <TagFilter tags={data.tags} />
        <AddTag />
        <div style={{ flex: 1 }}>
          <ItemSize />
          <ListItemView books={data.books.data} tags={data.tags} />
          <Paginator count={data.books.count} take={data.books.take} />
        </div>
      </div>
    </QueryClientProvider>
  );
}
