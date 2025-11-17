import Menu from "./Menu";
import { ItemViewPropsType } from "../types/types";
import { useState } from "react";
import { THUMBS_URL } from "../utils/envVar";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { Stack } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import { useItemViewChangeTagsMutation } from "../utils/Hooks/ItemViewHook.ts";
import { useTags } from "../utils/Hooks/TagsHook.ts";
import { VITE_API_MAIN } from "../utils/envVar";
export default function ItemView(props: ItemViewPropsType) {
  const [isFavorite, setIsFavorite] = useState<boolean>(
    props.itemView.prop.tags
      .map((tag) => tag.name.toLowerCase())
      .includes("favorite")
  );
  const tags = useTags();
  const mutate = useItemViewChangeTagsMutation(props.queryData, tags);
  function favoriteToggleHandler(isFavorite: boolean, path: string) {
    mutate({ isFavorite: isFavorite, path: path });
    setIsFavorite(!isFavorite);
  }
  return (
    <Stack>
      <Stack>
        <img
          src={THUMBS_URL + props.itemView.prop.thumbnail}
          alt={props.itemView.prop.title}
          loading="lazy"
        />
      </Stack>
      <Tooltip content={props.itemView.prop.title}>
        <p className="truncate w-50">{props.itemView.prop.title}</p>
      </Tooltip>
      <Stack direction={"row"}>
        {isFavorite ? (
          <FaHeart
            color="red"
            size={25}
            onClick={() => {
              favoriteToggleHandler(
                isFavorite,
                props.itemView.prop.path + "/" + props.itemView.prop.title
              );
            }}
          />
        ) : (
          <CiHeart
            color="red"
            size={25}
            onClick={() => {
              favoriteToggleHandler(
                isFavorite,
                props.itemView.prop.path + "/" + props.itemView.prop.title
              );
            }}
          />
        )}

        <Menu
          name={props.itemView.prop.title}
          itemTags={props.itemView.itemTags}
          id={props.itemView.prop.id}
          queryData={props.queryData}
          downloadPath={
            `${VITE_API_MAIN}pdfs/` + encodeURIComponent(props.itemView.prop.id)
          }
          path={props.itemView.prop.path}
          pages={props.itemView.prop.pages}
        />
      </Stack>
    </Stack>
  );
}
