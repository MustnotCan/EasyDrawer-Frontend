import { runtimeConfig } from "../entry.client";
const VITE_API_MAIN = runtimeConfig.VITE_API_MAIN;
export const BOOKS_URL = VITE_API_MAIN + "books/";
export const THUMBS_URL = VITE_API_MAIN + "images/";
export const TAGS_URL = VITE_API_MAIN + "tags/";
