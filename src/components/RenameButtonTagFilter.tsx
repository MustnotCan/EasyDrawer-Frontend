import { renameTag } from "../utils/queries/tagsApi.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Button, IconButton } from "@chakra-ui/react";
import { tagType } from "@/types/types.ts";

export function RenameButton(prop: {
  tagName: string;
  renaming: boolean;
  setRenaming: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [newValue, setNewValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (newName: string) =>
      renameTag({ prevName: prop.tagName, newName: newName }),
    onSuccess: (returnedTag: tagType) => {
      queryClient.setQueryData(["tags"], (oldTags: tagType[]) => {
        if (!oldTags) return [];
        return oldTags.map((tag) =>
          tag.id === returnedTag.id ? { ...tag, name: returnedTag.name } : tag
        );
      });
    },
    onError: (err) => {
      console.error("Error renaming tag:", err);
    },
  });
  const reNameTagOff: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    prop.setRenaming(true);
    console.log(inputRef.current);
    inputRef?.current?.focus();
  };
  const reNameTagOn: React.MouseEventHandler<HTMLButtonElement> = () => {
    console.log(newValue);
    mutate(newValue);
    prop.setRenaming(false);
  };
  useEffect(() => {
    if (prop.renaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [prop.renaming]);
  return (
    <div>
      {!prop.renaming && (
        <IconButton variant={"ghost"} size="sm" onClick={reNameTagOff}>
          <EditOutlined />
        </IconButton>
      )}
      {prop.renaming && (
        <>
          <label>New tag name</label>
          <input
            onBlur={(e) => {
              setNewValue(e.currentTarget.value);
            }}
            defaultValue={prop.tagName}
            ref={inputRef}
          />
          <Button size="sm" variant="outline" onClick={reNameTagOn}>
            Done
          </Button>
        </>
      )}
    </div>
  );
}
