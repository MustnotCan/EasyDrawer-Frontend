import * as z from "zod";
import {
  tagSchema,
  FileSchema,
  onlyPathAndTagsSchema,
  itemViewPropsSchema,
  itemViewSchema,
  ItemViewPropsSchema,
  reqBodySchema,
  returnedFilesSchema,
} from "./schemas";

export type tagType = z.infer<typeof tagSchema>;
export type FileType = z.infer<typeof FileSchema>;
export type itemViewPropsType = z.infer<typeof itemViewPropsSchema>;
export type onlyPathAndTagsType = z.infer<typeof onlyPathAndTagsSchema>;
export type returnedFilesType = z.infer<typeof returnedFilesSchema>;
export type itemViewType = z.infer<typeof itemViewSchema>;
export type ItemViewPropsType = z.infer<typeof ItemViewPropsSchema>;
export type reqBodyType = z.infer<typeof reqBodySchema>;

export type itemViewPropsNoTagsType = {
  [K in keyof FileType as K extends "tags" ? never : K]: FileType[K];
} & {
  id: string;
  lastOpened: string;
};
export type menuPropsType = {
  name: string;
  itemTags: tagType[];
  id: string;
  queryData: unknown[];
  downloadPath: string;
};
export type taggedTagsType = {
  id: string;
  action: string;
};
export type multiTaggerFilePropsType = { item: itemViewPropsType };
export type multiTaggerFolderPropsType = {
  setDir: React.Dispatch<React.SetStateAction<string[]>>;
  item: string;
  path: string;
};
export type selectedItemType = {
  path: string;
  type: string;
};
export type tagAdderPropsType = {
  name?: string;
  tags: tagType[];
  itemTags?: tagType[];
  queryData?: unknown[];
  sharedTags?: tagType[];
  unsharedTags?: tagType[];
  data?: string[];
  isMultiTag?: boolean;
};
