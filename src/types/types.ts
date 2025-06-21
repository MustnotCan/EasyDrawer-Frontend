export type tagType = { id: string; name: string };
export type FileType = {
  thumbnail: string;
  title: string;
  path: string;
  tags: tagType[];
};
export type tagAdderProps = {
  name?: string;
  tags: tagType[];
  itemTags?: tagType[];
  queryData?: unknown[];
  sharedTags?: tagType[];
  unsharedTags?: tagType[];
  data?: string[];
  isMultiTag?: boolean;
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
export type ItemViewProps = {
  itemView: itemView;
  queryData: unknown[];
};
export type menuProps = {
  name: string;
  itemTags: tagType[];
  id: string;
  queryData: unknown[];
  downloadPath: string;
};
export type reqBody = {
  data: itemViewProps[];
  count: number;
  take: number;
  pn: number;
};
export type taggedTags = {
  id: string;
  action: string;
};
export type multiTaggerFileProps = { item: itemViewProps };
export type multiTaggerFolderProps = {
  setDir: React.Dispatch<React.SetStateAction<string[]>>;
  item: string;
  path: string;
};
export type selectedItem = {
  path: string;
  type: string;
};
export type onlyPathAndTags = { fullpath: string; tags: tagType[] };
