import { multiTaggerFilePropsType } from "@/types/types";
import { THUMBS_URL } from "../../utils/envVar";
import { Stack } from "@chakra-ui/react";
import { Tooltip } from "../../ui/tooltip";

export function MultiTaggerFile(props: { item: multiTaggerFilePropsType }) {
  return (
    <Stack className="w-65 h-70">
      <img
        src={THUMBS_URL + props.item.thumbnail}
        alt={"Thumbnail not generated yet"}
        width={"80%"}
        height={"70%"}
        loading="lazy"
      />
      <Tooltip content={props.item.title}>
        <p className="truncate w-50">{props.item.title}</p>
      </Tooltip>
    </Stack>
  );
}
