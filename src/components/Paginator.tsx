import { ButtonGroup, IconButton, Pagination } from "@chakra-ui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function Paginator(props: {
  setPn: React.Dispatch<React.SetStateAction<number>>;
  count: number;
  pn: number;
}) {
  return (
    <Pagination.Root
      count={props.count}
      pageSize={1}
      page={props.pn}
      onPageChange={(e) => props.setPn(e.page)}
      siblingCount={1}
      alignSelf={"center"}
    >
      <ButtonGroup variant="ghost" size="sm">
        <Pagination.PrevTrigger asChild>
          <IconButton>
            <HiChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>

        <Pagination.Items
          render={(page) => (
            <IconButton variant={{ base: "ghost", _selected: "outline" }}>
              {page.value}
            </IconButton>
          )}
        />

        <Pagination.NextTrigger asChild>
          <IconButton>
            <HiChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
  );
}
