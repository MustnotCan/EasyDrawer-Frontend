import * as z from "zod";
export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
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
  lastOpened: z.string(),
});
export const itemViewSchema = z.object({
  prop: itemViewPropsSchema,
  showFullName: z.boolean(),
  itemTags: z.array(tagSchema),
});
export const ItemViewPropsSchema = z.object({
  itemView: itemViewSchema,
  queryData: z.array(z.unknown()),
});
export const reqBodySchema = z.object({
  data: z.array(itemViewPropsSchema),
  count: z.number(),
  take: z.number(),
  pn: z.number(),
});
export const returnedFilesSchema = z.object({
  dirs: z.array(z.string()),
  files: z.array(itemViewPropsSchema),
});
