import { Box, Button, Field, Input, Stack } from "@chakra-ui/react";
import { FormEvent } from "react";

export default function SearchBar(props: {
  setSearchInput: (arg0: string) => void;
}) {
  const handleSearchByName = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fData = new FormData(e.currentTarget);
    const searchInput = fData.get("searchInput") || "";
    props.setSearchInput(searchInput.toString());
  };
  return (
    <Box >
      <form onSubmit={handleSearchByName}>
        <Field.Root>
          <Stack direction={"row"} align={"center"}>
            <Field.Label whiteSpace={"nowrap"}>Search :</Field.Label>
            <Input type="search" name="searchInput" />
            <Button
              type="submit"
              variant={"outline"}
              size={{ base: "xs", md: "md" }}
            >
              Search
            </Button>
            <Button
              type="reset"
              variant={"outline"}
              onClick={() => props.setSearchInput("")}
              size={{ base: "xs", md: "md" }}
            >
              Clear
            </Button>
          </Stack>
        </Field.Root>
      </form>
    </Box>
  );
}
