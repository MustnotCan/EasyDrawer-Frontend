import { multiTaggerFileProps } from "@/types/types";
import { THUMBS_URL } from "../utils/envVar";
import { Stack } from "@chakra-ui/react";

export function MultiTaggerFile(props: multiTaggerFileProps) {
  return (
    <Stack className="w-30 h-50">
      <img
        src={THUMBS_URL + props.item.thumbnail}
        alt={props.item.title}
        width={"70%"}
        height={"70%"}
      />
      <p className="overflow-ellipsis line-clamp-3 max-w-200 max-h-200">
        {props.item.title}
      </p>
    </Stack>
  );
}
