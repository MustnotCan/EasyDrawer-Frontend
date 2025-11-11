import { useEffect, useRef, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Button, IconButton, Input } from "@chakra-ui/react";
import { useTags } from "../../utils/Hooks/RenameButtonTagFilterDataHook.ts";
export function RenameButton(prop: {
  tagName: string;
  renaming: boolean;
  setRenaming: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [newValue, setNewValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const mutate = useTags(prop.tagName);
  const reNameTagOff: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    prop.setRenaming(true);
    inputRef?.current?.focus();
  };
  const reNameTagOn = () => {
    mutate(newValue.slice(0, 1).toUpperCase() + newValue.slice(1));
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
        <IconButton variant={"ghost"} size="2xs" onClick={reNameTagOff}>
          <EditOutlined />
        </IconButton>
      )}
      {prop.renaming && (
        <>
          <label>New tag name</label>
          <Input
            onChange={(e) => {
              setNewValue(e.currentTarget.value);
            }}
            defaultValue={prop.tagName}
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key == "Enter" && newValue != "") {
                reNameTagOn();
              } else if (e.key == "Escape") {
                prop.setRenaming(false);
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
        </>
      )}
    </div>
  );
}
