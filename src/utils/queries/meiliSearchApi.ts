import { MeiliSearch } from "meilisearch";
import { getBooksDetails } from "./booksApi.ts";
import { hitResults, itemViewPropsSchema } from "../../types/schemas.ts";
import z from "zod";
import { hitResultsType } from "@/types/types.ts";
import { VITE_MEILISEARCH_URI, WEBHOOK_URL } from "../envVar.ts";

const client = new MeiliSearch({
  host: VITE_MEILISEARCH_URI ? VITE_MEILISEARCH_URI : "http://localhost:7700",
});

export async function search(props: {
  selectedIndexes: string[];
  query: string;
  hitsPerPage: number;
  offset: number;
}): Promise<
  { data: hitResultsType[]; estimatedTotalHits: number | undefined } | undefined
> {
  if (!props.query) return;
  else {
    try {
      const searchOptions = {
        limit: props.hitsPerPage,
        offset: props.offset * props.hitsPerPage,
        q: props.query,
      };
      let response;
      if (props.selectedIndexes.length > 1) {
        response = await client.multiSearch({
          federation: {
            limit: props.hitsPerPage,
            offset: props.offset * props.hitsPerPage,
          },
          queries: Array.from(
            props.selectedIndexes.map((index) => ({
              indexUid: index,
              q: props.query,
            }))
          ),
        });
      } else {
        response = await client
          .index(props.selectedIndexes[0])
          .search(props.query, {
            ...searchOptions,
            attributesToHighlight: ["content"],
            highlightPreTag:
              '<em style="background-color: rgba(255, 255, 150, 0.6); border-bottom: 2px solid orange; padding: 0 0.2em;">',
          });
      }
      //{"fileId":fileId,"pages":[{"page":page,"highlighted":highlighted},{"page":page,"highlighted":highlighted}]}
      const groupedHits: {
        fileId: string;
        pages: { page: number; highlighted: string }[];
      }[] = [];
      response.hits.forEach((hit) => {
        if (!groupedHits.map((gh) => gh.fileId).includes(hit["fileId"]))
          groupedHits.push({ fileId: hit["fileId"], pages: [] });
        groupedHits.forEach((value, index) => {
          if (value.fileId == hit["fileId"]) {
            if (!groupedHits[index].pages) groupedHits[index].pages = [];
            if (
              !groupedHits[index].pages
                .map((page) => page.page)
                .includes(hit["page"])
            ) {
              groupedHits[index].pages.push({
                page: hit["page"],
                highlighted: hit["_formatted"]!["content"],
              });
            }
          }
        });
      });
      const foundBooks = new Set(response.hits.map((hit) => hit.fileId));
      const foundBooksDetails = await getBooksDetails({
        files: Array.from(foundBooks),
      });
      const body = (await foundBooksDetails.json()) as object;
      const parsedBody = z.array(itemViewPropsSchema).parse(body);
      const groupedHitsWithDetails: hitResultsType[] = [];
      groupedHits.forEach((value) => {
        const found = parsedBody.find((item) => item.id == value.fileId);
        if (found)
          groupedHitsWithDetails.push({
            ...found,
            pages: value.pages,
          });
      });
      z.array(hitResults).parse(groupedHitsWithDetails);
      return {
        data: groupedHitsWithDetails,
        estimatedTotalHits: response["estimatedTotalHits"],
      };
    } catch (e) {
      console.log(e);
    }
  }
}
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
  );
}
export async function getIndexes() {
  try {
    const response = await client.getIndexes();

    return await Promise.all(
      response.results.map(async (res) => ({
        id: res["uid"],
        name: res["uid"],
        booksCount: formatBytes(
          (
            await (await client.getIndex(res["uid"])).getStats()
          ).rawDocumentDbSize
        ),
      }))
    );
  } catch (e) {
    console.log(e);
  }
}
export async function removeIndex(props: { index: string }) {
  try {
    return await client.deleteIndex(props.index);
  } catch (e) {
    console.log(e);
  }
}
export async function createWebhook() {
  const availableWebHooks = await client.getWebhooks();
  if (availableWebHooks.results.length == 0)
    await client.createWebhook({ url: WEBHOOK_URL });
}
export async function addIndex(props: { index: string }) {
  await createWebhook();
  try {
    const res = await client.createIndex(props.index, { primaryKey: "id" });
    await client.index(props.index).updateSettings({
      searchableAttributes: ["content"],
    });
    return res;
  } catch (e) {
    console.log(e);
  }
}
