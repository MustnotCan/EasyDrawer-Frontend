import { tagType } from "../utils/queries/tagsApi";

export interface FileType {
  thumbnail: string;
  title: string;
  path: string;
  tags: tagType[];
}
