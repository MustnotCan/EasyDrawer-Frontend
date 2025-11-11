import * as z from "zod";
export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export const tagWithCountSchema = tagSchema.extend({
  booksCount: z.number(),
});
export const FileSchema = z.object({
  thumbnail: z.string(),
  title: z.string(),
  path: z.string(),
  tags: z.array(tagSchema),
});
export const onlyPathAndTagsSchema = z.object({
  fullpath: z.string(),
  tags: z.array(tagSchema),
});
export const itemViewPropsSchema = FileSchema.extend({
  id: z.string(),
  lastAccess: z.string(),
  lastModified: z.string(),
  addedDate: z.string(),
});
export const multiTaggerFilePropsSchema = z.object({
  thumbnail: z.string(),
  title: z.string(),
  path: z.string(),
  id: z.string(),
  addedDate: z.string(),
});
export const changedTagsResponseSchema = z.object({
  title: z.string(),
  tags: z.array(tagSchema),
});
export const itemViewSchema = z.object({
  prop: itemViewPropsSchema,
  itemTags: z.array(tagSchema),
});
export const orderBySchema = z.object({
  criteria: z.string(),
  direction: z.string(),
});
export const listItemViewQueryDataSchema = z.tuple([
  z.number(),
  z.number(),
  z.string(),
  z.string(),
  z.boolean(),
  orderBySchema
]);
export const selectedItemSchema = z.object({
  path: z.string(),
  type: z.string(),
});
export const multiTaggerQueryDataSchema = z.tuple([
  z.string(),
  z.array(selectedItemSchema),
  z.array(selectedItemSchema),
]);
export const ItemViewPropsSchema = z.object({
  itemView: itemViewSchema,
  queryData: listItemViewQueryDataSchema,
});
export const reqBodySchema = z.object({
  data: z.array(itemViewPropsSchema),
  count: z.number(),
  take: z.number(),
  pn: z.number(),
});
export const returnedFilesSchema = z.object({
  dirs: z.array(z.string()),
  files: z.array(multiTaggerFilePropsSchema),
});

