import { multiTaggerFileProps } from "@/types/types";
import { THUMBS_URL } from "../../utils/envVar";
import { Stack } from "@chakra-ui/react";
import { Tooltip } from "../../ui/tooltip";

export function MultiTaggerFile(props: multiTaggerFileProps) {
  return (
    <Stack className="w-30 h-50">
      <img
        src={THUMBS_URL + props.item.thumbnail}
        alt={"Thumbnail not generated yet"}
        width={"70%"}
        height={"70%"}
      />
      <Tooltip content={props.item.title}>
        <p className="overflow-ellipsis line-clamp-3 max-w-200 max-h-200">
          {props.item.title}
        </p>
      </Tooltip>
    </Stack>
  );
}
