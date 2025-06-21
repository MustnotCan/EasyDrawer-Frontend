import { multiTaggerFolderProps } from "@/types/types";
import { Stack } from "@chakra-ui/react";
import { FaRegFolder } from "react-icons/fa6";

export function MultiTaggerFolder(props: multiTaggerFolderProps) {
  return (
    <Stack
      direction={"column"}
      style={{
        borderStyle: "solid",
        margin: "10px",
      }}
    >
      <FaRegFolder size={"100px"} />
      {props.item.slice(props.item.lastIndexOf("/") + 1)}
    </Stack>
  );
}
