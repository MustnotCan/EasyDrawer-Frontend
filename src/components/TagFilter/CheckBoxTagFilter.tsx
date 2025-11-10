import { Checkbox } from "@chakra-ui/react/checkbox";
import { DeleteButton } from "./DeleteButtonTagFilter";
import { useEffect, useMemo, useRef, useState } from "react";
import { RenameButton } from "./RenameButtonTagFilter";
import { tagWithCountType } from "../../types/types";
import { Box, Button, Input, Menu, Portal, Stack } from "@chakra-ui/react";
import { Tooltip } from "../../ui/tooltip";
import IndexTagFilter from "./IndexTagFilter";
import { UseMutateFunction } from "@tanstack/react-query";
import { CiMenuBurger } from "react-icons/ci";
import { EnqueuedTask } from "meilisearch";
type props = {
  cBoxes: string[];
  tag: tagWithCountType;
  onChangeHandler: (arg0: string) => void;
  deleteTagMutation:
    | UseMutateFunction<
        {
          id: string;
          name: string;
        },
        Error,
        {
          name: string;
        },
        unknown
      >
    | UseMutateFunction<
        EnqueuedTask | undefined,
        Error,
        {
          name: string;
        },
        unknown
      >;
  renameTagMutation:
    | UseMutateFunction<
        {
          id: string;
          name: string;
        },
        Error,
        {
          newName: string;
          prevName: string;
        },
        unknown
      >
    | undefined;
  filterKey: string;
};

export default function CheckBoxTagFilter({
  cBoxes,
  tag,
  onChangeHandler,
  deleteTagMutation,
  renameTagMutation,
  filterKey,
}: props) {
  const [renaming, setRenaming] = useState(false);
  const DeleteButtonMemo = useMemo(() => DeleteButton, []);
  const RenameButtonMemo = useMemo(() => RenameButton, []);
  const [newValue, setNewValue] = useState(tag.name);

  const reNameTagOn = () => {
    if (renameTagMutation)
      renameTagMutation({
        newName: newValue.slice(0, 1).toUpperCase() + newValue.slice(1),
        prevName: tag.name,
      });
    setRenaming(false);
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [renaming]);
  return (
    <Stack direction={"row"}>
      {!renaming && (
        <Checkbox.Root
          checked={cBoxes.includes(tag.name)}
          id={tag.name}
          variant={"outline"}
          height={"30px"}
        >
          <Checkbox.HiddenInput />
          <Stack
            onClick={() => {
              onChangeHandler(tag.name);
            }}
            direction={"row"}
          >
            <Checkbox.Control />
            <Checkbox.Label width={"100px"} maxWidth="120px">
              <Tooltip content={tag.name + " (" + tag.booksCount + ")"}>
                <Box
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {tag.name[0].toUpperCase() +
                    tag.name.slice(1) +
                    " (" +
                    tag.booksCount +
                    ")"}
                </Box>
              </Tooltip>
            </Checkbox.Label>
          </Stack>
          {!["unclassified", "favorite", "bin"].includes(
            tag.name.toLowerCase()
          ) && (
            <Menu.Root>
              <Menu.Trigger asChild onDoubleClick={(e) => e.stopPropagation()}>
                <CiMenuBurger size="20" />
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="unset">
                    <Stack direction={"row"}>
                      {!renaming && (
                        <Menu.Item value="delete" maxWidth={"10"}>
                          <DeleteButtonMemo
                            deleteTagMutation={deleteTagMutation}
                            tagName={tag.name}
                          />
                        </Menu.Item>
                      )}
                      {filterKey == "Tags" && (
                        <Menu.Item value="rename" maxWidth={"10"}>
                          <RenameButtonMemo setRenaming={setRenaming} />
                        </Menu.Item>
                      )}
                      {filterKey == "Tags" && (
                        <IndexTagFilter currentTag={tag.name} />
                      )}
                    </Stack>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          )}
        </Checkbox.Root>
      )}
      {renaming && (
        <Stack>
          <label>New name</label>
          <Input
            onChange={(e) => {
              setNewValue(e.currentTarget.value);
            }}
            defaultValue={tag.name}
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key == "Enter" && newValue != "") {
                reNameTagOn();
              } else if (e.key == "Escape") {
                setRenaming(false);
              }
            }}
          />
          <Button
            marginTop={"2"}
            size="sm"
            variant="outline"
            onClick={() => {
              if (newValue != "") {
                reNameTagOn();
              }
            }}
          >
            Done
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
