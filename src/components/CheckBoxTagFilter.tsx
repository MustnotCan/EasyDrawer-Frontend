import { Checkbox } from "@chakra-ui/react/checkbox";
import { DeleteButton } from "./DeleteButtonTagFilter";
import { useMemo, useState } from "react";
import { RenameButton } from "./RenameButtonTagFilter";
import { tagType } from "../types/types";
import { Box, Stack } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
type props = {
  cBoxes: string[];
  tag: tagType;
  onChangeHandler: (arg0: string) => void;
};
export default function CheckBoxTagFilter({
  cBoxes,
  tag,
  onChangeHandler,
}: props) {
  const [renaming, setRenaming] = useState(false);
  const DeleteButtonMemo = useMemo(() => DeleteButton, []);
  const RenameButtonMemo = useMemo(() => RenameButton, []);
  return (
    <Stack direction={"row"}>
      {!renaming && (
        <Checkbox.Root
          checked={cBoxes.includes(tag.name)}
          onClick={() => onChangeHandler(tag.name)}
          id={tag.name}
          variant={"outline"}
          form="tagFilteringForm"
        >
          <Checkbox.Control />
          <Checkbox.Label height={"30px"} width={"80px"}>
            <Tooltip content={tag.name}>
              <Box
                maxWidth="100px"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {tag.name}
              </Box>
            </Tooltip>
          </Checkbox.Label>
        </Checkbox.Root>
      )}

      {!["unclassified", "favorite"].includes(tag.name.toLowerCase()) &&
        !renaming && <DeleteButtonMemo tagName={tag.name} />}
      {!["unclassified", "favorite"].includes(tag.name.toLowerCase()) && (
        <RenameButtonMemo
          tagName={tag.name}
          renaming={renaming}
          setRenaming={setRenaming}
        />
      )}
    </Stack>
  );
}
