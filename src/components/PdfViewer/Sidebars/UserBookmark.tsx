import { bookmarkWithIdType } from "@/types/types";
import { Stack, Span, Input, Button, IconButton, Box } from "@chakra-ui/react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useScrollCapability } from "@embedpdf/plugin-scroll/react";
import { useContext, useRef, useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { Tooltip } from "../../../ui/tooltip";
import { bookmarkContext } from "../Store/BookmarkContext";
export default function UserBookMark(props: { bookmark: bookmarkWithIdType }) {
  const { bookmarks, removeBookmark, setBookmarks } =
    useContext(bookmarkContext);
  const [edit, setEdit] = useState<boolean>(false);
  const { provides: scrollApi } = useScrollCapability();
  const titleRef = useRef<HTMLInputElement | null>(null);

  if (!scrollApi) return;

  if (!edit) {
    return (
      <Stack
        direction={"row"}
        borderColor={"black"}
        padding={"1"}
        borderRadius={"2xs"}
        borderWidth={"thin"}
      >
        <Tooltip
          content={props.bookmark.bookmarkDetails.title}
          closeOnClick={true}
        >
          <Span
            fontSize={"sm"}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            onClick={() => {
              if (
                props.bookmark.bookmarkDetails.target?.type == "destination"
              ) {
                const x =
                  props.bookmark.bookmarkDetails.target.destination.view[0];
                const y =
                  props.bookmark.bookmarkDetails.target.destination.view[1];
                scrollApi.scrollToPage({
                  pageNumber:
                    props.bookmark.bookmarkDetails.target.destination.pageIndex,
                  behavior: "instant",
                  pageCoordinates: {
                    x: x,
                    y: y,
                  },
                });
              }
            }}
            cursor={"pointer"}
            width={"7vw"}
          >
            {props.bookmark.bookmarkDetails.title}
          </Span>
        </Tooltip>
        <Box flex={1} />
        <IconButton variant={"outline"} size={"2xs"}>
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => setEdit(true)}
          />
        </IconButton>
        <IconButton variant={"outline"} size={"2xs"}>
          <DeleteOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              const hasNext = bookmarks.find(
                (bk) => bk.preSibId == props.bookmark.id
              );
              if (hasNext) {
                const prevSib = props.bookmark.preSibId;
                setBookmarks([{ ...hasNext, preSibId: prevSib }]);
              }
              removeBookmark(props.bookmark.id!);
            }}
          />
        </IconButton>
      </Stack>
    );
  } else {
    return (
      <Stack
        direction={"row"}
        width={"15vw"}
        borderColor={"black"}
        justify={"center"}
        align={"center"}
      >
        <Input
          ref={titleRef}
          defaultValue={props.bookmark.bookmarkDetails.title}
        />
        <Button
          size={"2xs"}
          variant={"outline"}
          onClick={() => {
            const newTitle = titleRef.current?.value;
            if (newTitle && newTitle != props.bookmark.bookmarkDetails.title) {
              setBookmarks([
                {
                  ...props.bookmark,
                  bookmarkDetails: {
                    ...props.bookmark.bookmarkDetails,
                    title: newTitle,
                  },
                },
              ]);
            }
            setEdit(false);
          }}
        >
          <AiOutlineCheck />
        </Button>
        <Button size={"2xs"} variant={"outline"} onClick={() => setEdit(false)}>
          <AiOutlineClose />
        </Button>
      </Stack>
    );
  }
}
