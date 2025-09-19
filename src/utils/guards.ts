import ItemView from "../components/ItemView";
import { MultiTaggerFile } from "../components/MultiTagger/MultiTaggerFile";
import { MultiTaggerFolder } from "../components/MultiTagger/MultiTaggerFolder";
import {
  ItemViewPropsType,
  multiTaggerFilePropsType,
  multiTaggerFolderPropsType,
} from "@/types/types";

export function isItemView(
  element: React.ReactElement
): element is React.ReactElement<ItemViewPropsType> {
  return element.type === ItemView;
}
export function isMultiTaggerFileProps(
  element: React.ReactElement
): element is React.ReactElement<{ item: multiTaggerFilePropsType }> {
  return element.type === MultiTaggerFile;
}

export function isMultiTaggerFolderProps(
  element: React.ReactElement
): element is React.ReactElement<multiTaggerFolderPropsType> {
  return element.type === MultiTaggerFolder;
}
