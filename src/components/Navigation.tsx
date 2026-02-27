import { Stack } from "@chakra-ui/react";
import { ReactNode } from "react";
type BoxProps = {
  children: ReactNode;
};
export default function Navigation({ children }: BoxProps) {
  return (
    <Stack
      position={"fixed"}
      direction={"column"}
      background={"whitesmoke"}
      margin={0}
      padding={"1rem"}
      flex={1}
      height={"full"}
      width={{base:"100dvw",lg:"10dvw"}}
    >
      {children}
    </Stack>
  );
}
