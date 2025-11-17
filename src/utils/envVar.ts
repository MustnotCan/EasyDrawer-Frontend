import { runtimeConfig } from "../entry.client";
export const VITE_API_MAIN = runtimeConfig.VITE_API_MAIN;
export const VITE_MEILISEARCH_URI = runtimeConfig.VITE_MEILISEARCH_URI;
export const BOOKS_URL = VITE_API_MAIN + "books/";
export const THUMBS_URL = VITE_API_MAIN + "images/";
export const TAGS_URL = VITE_API_MAIN + "tags/";
export const SSE_URL = VITE_API_MAIN + "sse/";
export const WEBHOOK_URL = VITE_API_MAIN + "webhook/";
