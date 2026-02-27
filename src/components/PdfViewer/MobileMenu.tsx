import { Box } from "@chakra-ui/react";
import { ReactElement, useState } from "react";

export default function MobileMenu(props: { children: ReactElement }) {
  const [opened, setOpened] = useState(false);

  return (
    <Box
      zIndex={100}
      display={{ base: "block", lg: "none" }}
      pointerEvents={"none"}
      className="fixed inset-x-0 top-0 h-dvh"
    >
      {!opened && (
        <Box
          onClick={() => setOpened(true)}
          pointerEvents={"auto"}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-12 flex items-end justify-center"
        >
          <Box className="bg-gray-300/90 shadow-sm w-24 h-2 rounded-full" />
        </Box>
      )}

      <Box
        pointerEvents={"auto"}
        onClick={(e) => e.stopPropagation()}
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-fit bg-white
    transform transition-all duration-300 will-change-transform
    rounded-t-xl shadow-xl border border-gray-200
    ${opened ? "translate-y-0 opacity-100" : "translate-y-[calc(100%+1rem)] opacity-0"} 
  `}
      >
        {opened && (
          <Box
            onClick={() => setOpened(false)}
            className="flex flex-col items-center w-full h-10 sticky top-0 bg-white rounded-t-xl"
          >
            <Box className="bg-gray-300 w-14 h-2 rounded-full mt-3" />
          </Box>
        )}

        {props.children}
      </Box>
    </Box>
  );
}
