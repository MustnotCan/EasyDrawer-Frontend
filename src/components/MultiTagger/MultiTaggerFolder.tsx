import { multiTaggerFolderPropsType } from "@/types/types";
import { Stack } from "@chakra-ui/react";
import { FaRegFolder } from "react-icons/fa6";
import { Tooltip } from "../../ui/tooltip";

export function MultiTaggerFolder(props: multiTaggerFolderPropsType) {
  const folderName = props.item.slice(props.item.lastIndexOf("/") + 1);
  return (
    <Stack direction={"column"} className="items-center">
      <FaRegFolder size={"50%"} />
      <Tooltip content={folderName}>
        <p
          className="line-clamp-2 w-[20vw] sm:w-[13vw] lg:w-[11vw] text-center"
          style={{ lineHeight: "1.25rem", minHeight: "2.5rem" }}
        >
          {folderName}
        </p>
      </Tooltip>
    </Stack>
  );
}
