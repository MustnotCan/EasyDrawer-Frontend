import Menu from "./Menu";
import { itemView, itemViewProps, reqBody, tagType } from "../types/types";
import { MutableRefObject, useState } from "react";
import { THUMBS_URL } from "../utils/envVar";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { Stack } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeTags } from "../utils/queries/booksApi";
export default function ItemView(props: {
  itemView: itemView;
  toggleSelected: (item: string) => void;
  addToSelected: (item: string) => void;
  selected: boolean;
  isSelectionMode: boolean;
  setSelectionMode: (bool: boolean) => void;
  isFirst: MutableRefObject<boolean>;
  queryData: unknown[];
}) {
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
          console.log(newData);
          return {
            data: newData,
            count: prevBooks.count,
            pn: prevBooks.pn,
            take: prevBooks.take,
          };
        }
      );
    },
  });
  function favoriteToggleHandler(isFavorite: boolean, name: string) {
    mutate({ isFavorite: isFavorite, name: name });
    setIsFavorite(!isFavorite);
  }
  let timer = 0;
  const clickHandler = () => {
    if (!props.isFirst.current && props.isSelectionMode) {
      props.toggleSelected(props.itemView.prop.title);
    }
    if (props.isSelectionMode) {
      props.isFirst.current = false;
    } else {
      const pdfRoute = `${import.meta.env.VITE_API_MAIN}pdfs/`;
      const encodedUri = encodeURIComponent(
        props.itemView.prop.path.slice(
          "/home/saifparrot/Documents/Learn/".length
        ) +
          "/" +
          props.itemView.prop.title
      );
      console.log(pdfRoute);
      console.log(encodedUri);
      window.open(pdfRoute + encodedUri, "_blank", "noopener,noreferrer");
    }
  };
  return (
    <Stack>
      <Stack>
        <img
          loading="lazy"
          className={props.selected ? "opacity-50" : ""}
          src={THUMBS_URL + props.itemView.prop.thumbnail}
          alt={props.itemView.prop.title}
          onMouseDown={() => {
            if (!props.isSelectionMode) {
              timer = Date.now();
            }
          }}
          onClick={clickHandler}
          onMouseUp={() => {
            if (
              props.isFirst.current &&
              !props.isSelectionMode &&
              timer > 0 &&
              Date.now() - timer > 500
            ) {
              props.addToSelected(props.itemView.prop.title);
              props.setSelectionMode(true);
            }
            timer = 0;
          }}
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
        />
      </Stack>
    </Stack>
  );
}
