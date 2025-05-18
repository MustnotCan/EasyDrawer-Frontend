import { Stack } from "@chakra-ui/react";
import { ReactNode } from "react";
type BoxProps = {
  children: ReactNode;
};
export default function Navigation({ children }: BoxProps) {
  return (
    <Stack
      direction={"column"}
      maxWidth={"180px"}
      marginLeft={"1"}
      marginTop={"2"}
      marginRight={"5"}
      width={"1/2"}
      height={"max-content"}
      borderColor={"black"}
      borderWidth="thick"
    >
      {children}
    </Stack>
  );
}
