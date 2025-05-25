import Menu from "./Menu";
import { ItemViewProps, itemViewProps, reqBody, tagType } from "../types/types";
import { useState } from "react";
import { THUMBS_URL } from "../utils/envVar";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { Stack } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeTags } from "../utils/queries/booksApi";
export default function ItemView(props: ItemViewProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(
    props.itemView.prop.tags
      .map((tag) => tag.name.toLowerCase())
      .includes("favorite")
  );
  const queryClient = useQueryClient();
  const tags = queryClient.getQueryData(["tags"]) as tagType[];
  const { mutate } = useMutation({
    mutationFn: (args: { isFavorite: boolean; name: string }) => {
      const literal = {
        id: tags.filter((tag) => tag.name == "Favorite")[0].id,
        action: isFavorite ? "add" : "remove",
      };
      return changeTags([literal], args.name);
    },
    onSuccess: (modifiedBook: itemViewProps) => {
      queryClient.setQueryData(
        ["books", ...props.queryData],
        (prevBooks: reqBody): reqBody => {
          const newData = prevBooks.data.map((book) => {
            return book.title === modifiedBook.title
              ? { ...book, tags: modifiedBook.tags }
              : book;
          });
          return { ...prevBooks, data: newData };
        }
      );
    },
  });
  function favoriteToggleHandler(isFavorite: boolean, name: string) {
    mutate({ isFavorite: isFavorite, name: name });
    setIsFavorite(!isFavorite);
  }

  return (
    <Stack>
      <Stack>
        <img
          loading="lazy"
          src={THUMBS_URL + props.itemView.prop.thumbnail}
          alt={props.itemView.prop.title}
        />
      </Stack>
      <Stack className="mt-2 max-w-[250px]">
        {props.itemView.showFullName ? (
          <p className="truncate whitespace-normal">
            {props.itemView.prop.title}
          </p>
        ) : (
          <p className="truncate">{props.itemView.prop.title}</p>
        )}
      </Stack>
      <Stack direction={"row"} gap={"80%"}>
        {isFavorite ? (
          <FaHeart
            color="red"
            size={25}
            onClick={() => {
              favoriteToggleHandler(isFavorite, props.itemView.prop.title);
            }}
          />
        ) : (
          <CiHeart
            color="red"
            size={25}
            onClick={() => {
              favoriteToggleHandler(isFavorite, props.itemView.prop.title);
            }}
          />
        )}
        <Menu
          name={props.itemView.prop.title}
          itemTags={props.itemView.itemTags}
          id={props.itemView.prop.id}
          queryData={props.queryData}
          downloadPath={
            `${import.meta.env.VITE_API_MAIN}pdfs/` +
            encodeURIComponent(
              props.itemView.prop.path + "/" + props.itemView.prop.title
            )
          }
        />
      </Stack>
    </Stack>
  );
}
