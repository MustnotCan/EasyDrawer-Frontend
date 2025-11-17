import * as z from "zod";
export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export const tagWithCountSchema = tagSchema.extend({
  booksCount: z.union([z.number(), z.string()]),
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
  lastAccess: z.optional(z.string()),
  lastModified: z.optional(z.string()),
  addedDate: z.optional(z.string()),
  pages: z.optional(
    z.array(z.object({ page: z.number(), highlighted: z.string() }))
  ),
});
export const hitResults = itemViewPropsSchema.extend({
  pages: z.optional(
    z.array(z.object({ page: z.number(), highlighted: z.string() }))
  ),
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
  z.optional(z.string()),
  z.optional(z.string()),
  z.optional(z.boolean()),
  z.optional(orderBySchema),
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

export const returnedMeiliSearch = z.object({
  data: z.array(itemViewPropsSchema),
});
export const sseImportTaskSchema = z.object({
  current: z.number(),
  total: z.number(),
  setNumber: z.number(),
  error: z.optional(z.string()),
  fileTitle: z.optional(z.string()),
  addedFileDetails: z.optional(
    z.object({
      relativepath: z.string(),
      uuid: z.string(),
      thumbnail: z.string(),
      addedDate: z.string(),
    })
  ),
});
export const sseIndexingTaskSchema = sseImportTaskSchema.extend({
  index: z.string(),
});
export const itemViewSelectedSchema = z.object({
  tags: z.array(tagSchema),
  title: z.string(),
  path: z.string(),
  id: z.string(),
  addedDate: z.string(),
});
