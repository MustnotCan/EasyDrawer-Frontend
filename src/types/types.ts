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
  queryData: unknown[];
};
export type itemViewProps = {
  thumbnail: string;
  title: string;
  id: string;
  path: string;
  tags: tagType[];
  lastOpened: string;
};

export type itemView = {
  prop: itemViewProps;
  showFullName: boolean;
  itemTags: tagType[];
};
export type menuProps = {
  name: string;
  itemTags: tagType[];
  id: string;
  queryData: unknown[];
};
export type reqBody = {
  data: itemViewProps[];
  count: number;
  take: number;
  pn: number;
};
