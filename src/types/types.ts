export type tagType = { id: string; name: string };
export type FileType = {
  thumbnail: string;
  title: string;
  path: string;
  tags: tagType[];
};
export type tagAdderProps = {
  name: string;
  tags: tagType[];
  itemTags: tagType[];
};
export type itemViewProps = {
  thumbnail: string;
  title: string;
  id: string;
  path: string;
  tags: tagType[];
  like: boolean;
  markForLater: boolean;
  lastOpened: Date;
};
export type itemView = {
  prop: itemViewProps;
  showFullName: boolean;
  existingTags: tagType[];
  itemTags: tagType[];
};
export type menuProps = {
  name: string;
  tags: tagType[];
  itemTags: tagType[];
  id: string;
  markForLater: boolean;
};
export type reqBody = { data: []; count: number; take: number; pn: number };
