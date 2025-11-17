import { Stack } from "@chakra-ui/react";

export default function TaskStatus(props: {
  task: string;
  current: number;
  total: number;
  set: number;
}) {
  return (
    <Stack>
      <span>
        Set : {props.set} of {props.task} tasks started.
      </span>
      <span>
        progress : {props.current}/{props.total}
      </span>
    </Stack>
  );
}
