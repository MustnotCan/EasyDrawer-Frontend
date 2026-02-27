import { multiTaggerFilePropsType } from "@/types/types";
import { THUMBS_URL } from "../../utils/envVar";
import { Stack } from "@chakra-ui/react";
import { Tooltip } from "../../ui/tooltip";

export function MultiTaggerFile(props: { item: multiTaggerFilePropsType }) {
  return (
    <Stack>
      <img
        src={THUMBS_URL + props.item.thumbnail}
        alt={"Thumbnail not generated yet"}
        loading="lazy"
      />
      <Tooltip content={props.item.title}>
        <p
          className="line-clamp-2 w-[20vw] sm:w-[13vw] lg:w-[11vw] text-center"
          style={{ lineHeight: "1.25rem", minHeight: "2.5rem" }}
        >
          {props.item.title}
        </p>
      </Tooltip>
    </Stack>
  );
}
