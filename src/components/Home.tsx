import { Box, IconButton, Span, Stack } from "@chakra-ui/react";
import Navigation from "./Navigation";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { SSE_URL } from "../utils/envVar";
import { Toaster, toaster } from "../ui/toaster";
import { useQueryClient } from "@tanstack/react-query";
import TaskStatus from "./TaskStatus";
import { useMultiTaggerImport } from "@/utils/Hooks/MultiTaggerHooks";
import { sseImportTaskSchema, sseIndexingTaskSchema } from "@/types/schemas";
import { IoMenu } from "react-icons/io5";
export default function Home() {
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  const [navMenuOpen, setNavMenuOpen] = useState(isTouchDevice ? false : true);
  useSSE();
  const onClickNavigationHandler = () => setNavMenuOpen((prev) => !prev);

  return (
    <Stack gap={0} height={"100dvh"} width={"100dvw"} direction={"column"}>
      <header className="bg-red-200  fixed h-12 w-full z-10 block lg:hidden">
        <IconButton
          onClick={onClickNavigationHandler}
          size={"xl"}
          backgroundColor={"transparent"}
        >
          <IoMenu color="black" />
        </IconButton>
      </header>
      <Stack
        direction={"row"}
        flex={1}
        marginTop={{ base: "3rem", lg: 0 }}
        align={{ base: navMenuOpen ? "normal" : "center", lg: "normal" }}
        alignItems={"start"}
      >
        {navMenuOpen && (
          <Navigation>
            <NavLink
              setNavMenu={setNavMenuOpen}
              to="/browse"
              title="Browse Books"
            />
            <NavLink
              setNavMenu={setNavMenuOpen}
              to="/favorite"
              title="Favorite Books"
            />
            <NavLink
              setNavMenu={setNavMenuOpen}
              to="/unclassified"
              title="Unclassified Books"
            />
            <NavLink
              setNavMenu={setNavMenuOpen}
              to="/multitagger"
              title="Multi tagger"
            />

            <NavLink
              setNavMenu={setNavMenuOpen}
              to="/fts"
              title="Full-text Search"
            />
          </Navigation>
        )}
        <Box
          display={{ base: navMenuOpen ? "none" : "block", lg: "block" }}
          marginLeft={{ base: 0, lg: "9.8dvw" }}
          height={"full"}
        >
          <Outlet />
        </Box>
        <Toaster />
      </Stack>
    </Stack>
  );
}
const useSSE = () => {
  const queryClient = useQueryClient();
  const existingIndexToaster = useRef<string>();
  const existingImportToaster = useRef<string>();
  const updateCache = useMultiTaggerImport();
  useEffect(() => {
    const eventSource = new EventSource(SSE_URL);
    eventSource.addEventListener("indexingSucceeded", (event) => {
      const data = sseIndexingTaskSchema.parse(JSON.parse(event.data));
      if (existingIndexToaster.current == undefined)
        existingIndexToaster.current = toaster.create({
          description: (
            <TaskStatus
              task={"Indexing"}
              current={data.current}
              total={data.total}
              set={data.setNumber}
            />
          ),
          type: data.current == data.total ? "success" : "progress",
          closable: data.current == data.total,
          duration: Infinity,
        });
      toaster.update(existingIndexToaster.current, {
        description: (
          <TaskStatus
            task={"Indexing"}
            current={data.current}
            total={data.total}
            set={data.setNumber}
          />
        ),
        closable: data.current == data.total,
        type: data.current == data.total ? "success" : "progress",
        duration: Infinity,
      });
    });

    eventSource.addEventListener("indexingFailed", (event) => {
      const data = sseIndexingTaskSchema.parse(JSON.parse(event.data));
      const failedIndexId = toaster.create({
        description: `Indexing ${data.fileTitle} failed, ${
          data.current != data.total ? "continuing ..." : ""
        }`,
        type: "error",
        closable: data.current == data.total ? true : false,
        duration: 3000,
        action: {
          label: "Clear",
          onClick: () => toaster.dismiss(failedIndexId),
        },
      });
    });
    eventSource.addEventListener("successImport", (event) => {
      const data = sseImportTaskSchema.parse(JSON.parse(event.data));
      updateCache({
        title: data.fileTitle!,
        addedDate: data.addedFileDetails!.addedDate,
        id: data.addedFileDetails!.uuid,
        path: data.addedFileDetails!.relativepath,
        thumbnail: data.addedFileDetails!.thumbnail,
      });
      if (existingImportToaster.current == undefined)
        existingImportToaster.current = toaster.create({
          description: (
            <TaskStatus
              task={"Importing"}
              current={data.current}
              total={data.total}
              set={data.setNumber}
            />
          ),
          type: data.current == data.total ? "success" : "progress",
          closable: data.current == data.total ? true : false,
          duration: Infinity,
        });
      toaster.update(existingImportToaster.current, {
        description: (
          <TaskStatus
            task={"Importing"}
            current={data.current}
            total={data.total}
            set={data.setNumber}
          />
        ),
        type: data.current == data.total ? "success" : "progress",
        closable: data.current == data.total,
        duration: Infinity,
      });
    });
    eventSource.addEventListener("failedImport", (event) => {
      const data = sseImportTaskSchema.parse(JSON.parse(event.data));
      const failedImportId = toaster.create({
        description: `Importing ${data.fileTitle} failed, ${
          data.current != data.total ? "continuing ..." : ""
        }`,
        type: "error",
        closable: data.current == data.total ? true : false,
        duration: 2000,
        action: {
          label: "Clear",
          onClick: () => toaster.dismiss(failedImportId),
        },
      });
    });
    eventSource.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.type == "indexCreation" || data.type == "indexDeletion") {
        queryClient.fetchQuery({ queryKey: ["indexes"] });
      }
      if (data.type != "documentAdditionOrUpdate")
        toaster.create({
          description: `A task of type ${data.type} in the index ${data.index} has ${data.status}`,
          type: "info",
          closable: true,
          duration: 3000,
        });
    });

    return () => eventSource.close();
  }, [queryClient, updateCache]);
};
function NavLink(props: {
  to: string;
  className?: string;
  title: string;
  setNavMenu: (bool: boolean) => void;
}) {
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  return (
    <Link
      to={props.to}
      onClick={() => {
        if (isTouchDevice) props.setNavMenu(false);
      }}
    >
      <Span
        fontSize={{ base: "2xl", md: "xl", lg: "md" }}
        className={props.className ?? "text-wrap "}
      >
        {props.title}
      </Span>
    </Link>
  );
}
