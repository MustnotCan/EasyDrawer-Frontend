import { Checkbox } from "@chakra-ui/react/checkbox";
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { tagWithCountType } from "../../types/types";
import {
  Button,
  IconButton,
  Input,
  Menu,
  Portal,
  Span,
  Stack,
} from "@chakra-ui/react";
import { Tooltip } from "../../ui/tooltip";
import IndexTagFilter from "./IndexTagFilter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CiMenuBurger } from "react-icons/ci";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { removeBooksWithTag } from "../../utils/queries/booksApi";

type props = {
  cBoxes: string[];
  tag: tagWithCountType;
  onChangeHandler: (arg0: string) => void;
  disableMenuPortal?: boolean;
  deleteTagMutation: ({ name }: { name: string }) => void;
  renameTagMutation: ({
    newName,
    prevName,
  }: {
    newName: string;
    prevName: string;
  }) => void;
  filterKey: string;
};

export default function CheckBoxTagFilter({
  cBoxes,
  tag,
  onChangeHandler,
  disableMenuPortal,
  deleteTagMutation,
  renameTagMutation,
  filterKey,
}: props) {
  const [renaming, setRenaming] = useState(false);

  const [newValue, setNewValue] = useState(tag.name);

  const reNameTagOn = () => {
    if (renameTagMutation)
      renameTagMutation({
        newName: newValue.slice(0, 1).toUpperCase() + newValue.slice(1),
        prevName: tag.name,
      });
    setRenaming(false);
  };
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const emptyBinMutation = useMutation({
    mutationFn: (tag: string) => removeBooksWithTag(tag),
    onSuccess: (_, tag) => {
      queryClient.setQueryData(["tags"], (prev: tagWithCountType[]) =>
        prev.map((tg) => (tg.name == tag ? { ...tg, booksCount: 0 } : tg)),
      );
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["Dirs&files"] });
    },
  });
  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [renaming]);
  if (!renaming) {
    return (
      <TagCheckBox
        cBoxes={cBoxes}
        deleteTagMutation={deleteTagMutation}
        emptyBinMutation={emptyBinMutation}
        filterKey={filterKey}
        disableMenuPortal={disableMenuPortal}
        onChangeHandler={onChangeHandler}
        renaming={renaming}
        setRenaming={setRenaming}
        tag={tag}
      />
    );
  } else {
    return (
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
    );
  }
}
function TagCheckBox(props: {
  cBoxes: string | any[];
  tag: tagWithCountType;
  onChangeHandler: (arg0: any) => void;
  renaming: any;
  setRenaming: Dispatch<SetStateAction<boolean>>;
  disableMenuPortal?: boolean;
  deleteTagMutation: ({ name }: { name: string }) => void;
  filterKey: string;
  emptyBinMutation: { mutate: (arg0: string) => void };
}) {
  return (
    <Checkbox.Root
      checked={props.cBoxes.includes(props.tag.name)}
      id={props.tag.name}
      variant={"outline"}
      flex={1}
      minW={0}
      margin={0}
      padding={0}
      height={"fit"}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control
        onClick={() => {
          props.onChangeHandler(props.tag.name);
        }}
      />
      <Checkbox.Label
        flex={2}
        minWidth={0}
        maxWidth={"80dvw"}
        onClick={() => {
          props.onChangeHandler(props.tag.name);
        }}
      >
        <Tooltip content={props.tag.name + " (" + props.tag.booksCount + ")"}>
          <Span
            display="block"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {props.tag.name[0].toUpperCase() +
              props.tag.name.slice(1) +
              " (" +
              props.tag.booksCount +
              ")"}
          </Span>
        </Tooltip>
      </Checkbox.Label>
      {!["unclassified", "favorite", "bin"].includes(
        props.tag.name.toLowerCase(),
      ) && (
        <Menu.Root positioning={{ placement: "right-start", gutter: 0 }}>
          <Menu.Trigger
            asChild
            onDoubleClick={(e) => e.stopPropagation()}
            justifyContent={"end"}
            justifyItems={"end"}
          >
            <CiMenuBurger />
          </Menu.Trigger>
          <Portal disabled={props.disableMenuPortal}>
            <Menu.Positioner>
              <Menu.Content
                width={"max-content"}
                minWidth={0}
                height={"max-content"}
                padding={{ base: "0", md: "0.4rem", lg: "0.5rem" }}
                overflowX={{ base: "visible", md: "visible" }}
                overflowY="visible"
              >
                <Stack
                  direction={{ base: "row" }}
                  gap={{ base: 1, md: 1 }}
                  width={"max-content"}
                  height={"fit-content"}
                  padding={0}
                >
                  {!props.renaming && (
                    <Menu.Item
                      value="delete"
                      width={"fit-content"}
                      height={"fit-content"}
                      padding={0}
                    >
                      <CheckboxButton
                        onClick={() =>
                          props.deleteTagMutation({ name: props.tag.name })
                        }
                        content="Delete"
                        icon={<DeleteOutlined />}
                      />
                    </Menu.Item>
                  )}
                  {props.filterKey == "Tags" && (
                    <Menu.Item
                      value="rename"
                      width={"fit-content"}
                      height={"fit-content"}
                      padding={0}
                    >
                      <CheckboxButton
                        onClick={() => props.setRenaming((prev) => !prev)}
                        icon={<EditOutlined />}
                        content="Rename"
                      />
                    </Menu.Item>
                  )}
                  {props.filterKey == "Tags" && (
                    <IndexTagFilter
                      currentTag={props.tag.name}
                      disableMenuPortal={props.disableMenuPortal}
                    />
                  )}
                </Stack>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      )}
      {props.tag.name.toLowerCase() == "bin" && (
        <CheckboxButton
          content="Delete"
          icon={<DeleteOutlined />}
          onClick={() => {
            props.emptyBinMutation.mutate("bin");
          }}
        />
      )}
    </Checkbox.Root>
  );
}
function CheckboxButton(props: {
  content: string;
  onClick: () => void;
  icon: ReactElement;
}) {
  return (
    <IconButton variant={"ghost"} size={{ base: "xs" }} onClick={props.onClick}>
      <Tooltip content={props.content}>{props.icon}</Tooltip>
    </IconButton>
  );
}
