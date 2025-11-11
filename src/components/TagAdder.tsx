import { FormEvent } from "react";
import { useCallback } from "react";
import { Button, Input, Stack } from "@chakra-ui/react";
import { useMutateTags } from "../utils/Hooks/TagAdderDataHook.ts";

export default function TagAdder() {
  const mutate = useMutateTags();
  const addTagFormAction = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fData = new FormData(e.currentTarget);
      const toAddTag = fData.get("input")?.toString();
      if (toAddTag && toAddTag.length > 0) {
        mutate({
          name: toAddTag[0].toUpperCase() + toAddTag.slice(1),
        });
        e.currentTarget.reset();
      }
    },
    [mutate]
  );
  return (
    <form method="post" onSubmit={addTagFormAction}>
      <Stack direction={"column"}>
        <Input name="input" placeholder="Tag name" required />
        <Button type="submit" variant={"outline"} alignSelf={"start"}>
          Add
        </Button>
      </Stack>
    </form>
  );
}
