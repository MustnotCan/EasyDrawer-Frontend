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
  listItemViewQueryDataSchema,
  multiTaggerQueryDataSchema,
  changedTagsResponseSchema,
  tagWithCountSchema,
  orderBySchema,
  multiTaggerFilePropsSchema,
  hitResults,
} from "./schemas";

export type tagType = z.infer<typeof tagSchema>;
export type tagWithCountType = z.infer<typeof tagWithCountSchema>;

export type FileType = z.infer<typeof FileSchema>;
export type itemViewPropsType = z.infer<typeof itemViewPropsSchema>;
export type onlyPathAndTagsType = z.infer<typeof onlyPathAndTagsSchema>;
export type returnedFilesType = z.infer<typeof returnedFilesSchema>;
export type itemViewType = z.infer<typeof itemViewSchema>;
export type ItemViewPropsType = z.infer<typeof ItemViewPropsSchema>;
export type reqBodyType = z.infer<typeof reqBodySchema>;
export type listItemViewQueryDataType = z.infer<
  typeof listItemViewQueryDataSchema
>;
export type multiTaggerQueryDataType = z.infer<
  typeof multiTaggerQueryDataSchema
>;
export type changedTagsResponseType = z.infer<typeof changedTagsResponseSchema>;
export type orderByType = z.infer<typeof orderBySchema>;
export type multiTaggerFilePropsType = z.infer<
  typeof multiTaggerFilePropsSchema
>;

export type itemViewPropsNoTagsType = {
  [K in keyof FileType as K extends "tags" ? never : K]: FileType[K];
} & {
  id: string;
  lastOpened: string;
};
export type itemViewMenuPropsType = {
  name: string;
  itemTags: tagType[];
  id: string;
  path: string;
  queryData: listItemViewQueryDataType;
  downloadPath: string;
  pages?: { page: number; highlighted: string }[];
};
export type taggedTagsType = {
  id: string;
  action: string;
};
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
  queryData: multiTaggerQueryDataType | listItemViewQueryDataType;
  sharedTags?: tagType[];
  unsharedTags?: tagType[];
  data?: string[];
  isMultiTag?: boolean;
};

export type hitResultsType = z.infer<typeof hitResults>;
