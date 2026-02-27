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
      alignContent={"end"}
      marginBottom={{ base: "4rem", lg: 0 }}
      paddingBottom={{ base: "env(safe-area-inset-bottom)", lg: 0 }}
      gap={0}
    >
      <ButtonGroup variant="ghost" size="sm">
        <Pagination.PrevTrigger asChild>
          <IconButton>
            <HiChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>

        <Pagination.Items
          render={(page) => (
            <IconButton
              variant={{ base: "ghost", _selected: "outline" }}
              size={{base:"2xs","md":"xs",lg:"sm"}}
            >
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
