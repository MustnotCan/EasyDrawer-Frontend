import ItemView from "../components/ItemView";
import { MultiTaggerFile } from "../components/MultiTaggerFile";
import { MultiTaggerFolder } from "../components/MultiTaggerFolder";
import {
  ItemViewProps,
  multiTaggerFileProps,
  multiTaggerFolderProps,
} from "@/types/types";

export function isItemView(
  element: React.ReactElement
): element is React.ReactElement<ItemViewProps> {
  return element.type === ItemView;
}
export function isMultiTaggerFileProps(
  element: React.ReactElement
): element is React.ReactElement<multiTaggerFileProps> {
  return element.type === MultiTaggerFile;
}

export function isMultiTaggerFolderProps(
  element: React.ReactElement
): element is React.ReactElement<multiTaggerFolderProps> {
  return element.type === MultiTaggerFolder;
}
