import { ReactElement, useContext, useState } from "react";
import { bookmarkContext } from "../Store/BookmarkContext";
import { Accordion, Span, Stack, Box } from "@chakra-ui/react";
import { bookmarkWithIdType } from "@/types/types";
import UserBookMark from "./UserBookmark";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { drag, dragAndReorder } from "../tools";

export default function UserBookMarks() {
  const { bookmarks, setBookmarks } = useContext(bookmarkContext);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );
  if (!bookmarks || bookmarks.length == 0) {
    return <Span padding={5} width={200}>No user bookmarks found</Span>;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => {
        setActiveId(e.active.id as string);
        setOverId(null);
      }}
      onDragOver={(e) => {
        if (e.over && e.over.id) setOverId(e.over.id.toString());
      }}
      onDragEnd={({ active, over }) => {
        if (!over) return;
        const data = over.data.current;
        if (!data) return;
        if (data.type === "reorder") {
          const targetId = data.id;
          const activeId = active.id;
          const { newDragged, newDraggedTo, newActiveNext, newOldNext } =
            dragAndReorder(bookmarks, activeId.toString(), targetId);
          const changedNodes = [
            newDragged,
            newDraggedTo,
            newActiveNext,
            newOldNext,
          ].filter((bk) => bk != null);
          if (changedNodes.length > 0) setBookmarks(changedNodes);
        } else {
          const targetId = data.targetId;
          const activeId = active.id;
          const { newActive, newOldNext } = drag(
            bookmarks,
            activeId.toString(),
            targetId
          );
          const changedNodes = [newActive, newOldNext].filter(
            (bk) => bk != null
          );
          if (changedNodes.length > 0) setBookmarks(changedNodes);
        }
        setActiveId(null);
        setOverId(null);
      }}
      onDragCancel={() => {
        setActiveId(null);
        setOverId(null);
      }}
    >
      <DropOnItem id="root">
        <UserBookmarksRecursiveAccordion
          bookmarks={bookmarks}
          overId={overId}
          isRoot
          parentId={null}
          activeId={activeId}
        />
      </DropOnItem>

      <DragOverlay />
    </DndContext>
  );
}

function UserBookmarksRecursiveAccordion(props: {
  bookmarks: bookmarkWithIdType[];
  parentId: string | null;
  overId: string | null;
  isRoot?: boolean;
  activeId: string | null;
}) {
  return (
    <Accordion.Root
      variant={"plain"}
      multiple
      paddingLeft="0.5vw"
      {...(props.isRoot
        ? {
            maxHeight: "90vh",
            overflowY: "auto",
            marginLeft: "0vw",
            marginRight: "0vw",
            maxWidth: "20rem",
          }
        : {})}
    >
      {sortByPreSib(
        props.bookmarks.filter((bk) => bk.parentId == props.parentId)
      ).map((item) => {
        const children = props.bookmarks.filter((bk) => bk.parentId == item.id);
        return (
          <Box key={item.id}>
            <InsertZone id={item.id!}></InsertZone>

            <Accordion.Item value={item.bookmarkDetails.title || ""}>
              <Stack padding={2} direction="column">
                <Draggable id={item.id!}>
                  <DropOnItem id={item.id!}>
                    <Stack direction={"row"}>
                      <UserBookMark bookmark={item} />
                      {children && children?.length > 0 && (
                        <Accordion.ItemTrigger>
                          <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                      )}
                    </Stack>
                  </DropOnItem>
                </Draggable>
                {children && children.length > 0 && (
                  <Accordion.ItemContent>
                    <UserBookmarksRecursiveAccordion
                      overId={props.overId}
                      bookmarks={props.bookmarks}
                      isRoot={false}
                      parentId={item.id!}
                      activeId={props.activeId}
                    />
                  </Accordion.ItemContent>
                )}
              </Stack>
            </Accordion.Item>
          </Box>
        );
      })}
    </Accordion.Root>
  );
}

function sortByPreSib(items: bookmarkWithIdType[]) {
  const result: bookmarkWithIdType[] = [];
  let current = items.find((b) => b.preSibId == null);
  if (!current) return items; // safety
  result.push(current);
  while (true) {
    const next = items.find((b) => b.preSibId === current!.id);
    if (!next) break;
    result.push(next);
    current = next;
  }
  for (const item of items) {
    if (!result.includes(item)) {
      result.push(item);
    }
  }
  return result;
}

function Draggable(props: { id: string; children: ReactElement }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: props.id,
  });

  return (
    <Box ref={setNodeRef} {...attributes} {...listeners} cursor="grab">
      {props.children}
    </Box>
  );
}

function InsertZone(props: { id: string }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `insert-${props.id}`,
    data: { type: "reorder", id: props.id },
  });
  return (
    <Box
      ref={setNodeRef}
      height="10px"
      background={isOver ? "blue.300" : "transparent"}
      transition="background 150ms"
    ></Box>
  );
}

function DropOnItem(props: { id: string; children: ReactElement }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${props.id}`,
    data: { targetId: props.id },
  });

  return (
    <Box
      ref={setNodeRef}
      background={isOver ? "orange.100" : "transparent"}
      borderRadius="md"
      width={"fit-content"}
      transition="background 120ms"
    >
      {props.children}
    </Box>
  );
}
