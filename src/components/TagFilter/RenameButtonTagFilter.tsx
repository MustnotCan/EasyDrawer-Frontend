import { EditOutlined } from "@ant-design/icons";
import { IconButton } from "@chakra-ui/react";
import { Tooltip } from "../../ui/tooltip";

export function RenameButton(props: {
  setRenaming: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div>
      {
        <IconButton
          variant={"ghost"}
          size="2xs"
          onClick={() => props.setRenaming((prev) => !prev)}
        >
          <Tooltip content="rename">
            <EditOutlined />
          </Tooltip>
        </IconButton>
      }
    </div>
  );
}
