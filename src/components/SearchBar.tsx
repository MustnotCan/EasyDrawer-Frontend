import { Box, Button, Field, Input, Stack } from "@chakra-ui/react";
import { FormEvent } from "react";

export default function SearchBar({
  setSearchInput,
}: {
  setSearchInput: (arg0: string) => void;
}) {
  const handleSearchByName = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fData = new FormData(e.currentTarget);
    const searchInput = fData.get("searchInput") || "";
    setSearchInput(searchInput.toString());
  };
  return (
    <Box borderWidth={"thin"} borderColor={"black"} paddingLeft={2}>
      <form onSubmit={handleSearchByName}>
        <Field.Root>
          <Stack direction={"row"}>
            <Field.Label whiteSpace={"nowrap"}>
              Search books by name:
            </Field.Label>
            <Input type="search" name="searchInput" />
            <Button type="submit" variant={"outline"}>
              Search
            </Button>
            <Button
              type="reset"
              variant={"outline"}
              onClick={() => setSearchInput("")}
            >
              Clear
            </Button>
          </Stack>
        </Field.Root>
      </form>
    </Box>
  );
}
