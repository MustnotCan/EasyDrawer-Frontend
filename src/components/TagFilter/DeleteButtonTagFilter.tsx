import { IconButton } from "@chakra-ui/react";
import { DeleteOutlined } from "@ant-design/icons";
import { UseMutateFunction } from "@tanstack/react-query";
import { Tooltip } from "../../ui/tooltip";
import { EnqueuedTask } from "meilisearch";

export function DeleteButton(props: {
  tagName: string;
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
}) {
  return (
    <IconButton
      variant={"ghost"}
      size={"2xs"}
      onClick={() => props.deleteTagMutation({ name: props.tagName })}
    >
      <Tooltip content="delete">
        <DeleteOutlined />
      </Tooltip>
    </IconButton>
  );
}
