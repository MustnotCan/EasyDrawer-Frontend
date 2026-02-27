import { FormEvent } from "react";
import { Button, Input, Stack } from "@chakra-ui/react";

export default function TagAdder(props: {
  mutate: ({ name }: { name: string }) => void;
  filterKey: string;
}) {
  const addTagFormAction = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fData = new FormData(e.currentTarget);
    const toAddTag = fData.get("input")?.toString();
    if (toAddTag && toAddTag.length > 0) {
      props.mutate({
        name: toAddTag[0].toUpperCase() + toAddTag.slice(1),
      });
      e.currentTarget.reset();
    }
  };
  return (
    <form method="post" onSubmit={addTagFormAction}>
      <Stack direction={"column"}>
        <Input
          name="input"
          placeholder={props.filterKey + " " + "name"}
          required
        />
        <Button type="submit" variant={"outline"} alignSelf={"start"}>
          Add
        </Button>
      </Stack>
    </form>
  );
}
