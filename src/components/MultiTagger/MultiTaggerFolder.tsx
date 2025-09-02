import { multiTaggerFolderPropsType } from "@/types/types";
import { Stack } from "@chakra-ui/react";
import { FaRegFolder } from "react-icons/fa6";
import { Tooltip } from "../../ui/tooltip";

export function MultiTaggerFolder(props: multiTaggerFolderPropsType) {
  const folderName = props.item.slice(props.item.lastIndexOf("/") + 1);
  return (
    <Stack direction={"column"} className="w-40 h-40 items-center">
      <FaRegFolder size={"50%"} />
      <Tooltip content={folderName}>
        <p className="truncate max-w-40 max-h-40 ">{folderName}</p>
      </Tooltip>
    </Stack>
  );
}
