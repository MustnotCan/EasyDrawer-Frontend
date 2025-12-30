import { Stack } from "@chakra-ui/react";
import Navigation from "./Navigation";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { SSE_URL } from "../utils/envVar";
import { Toaster, toaster } from "../ui/toaster";
import { useQueryClient } from "@tanstack/react-query";
import TaskStatus from "./taskStatus";
import { sseImportTaskSchema, sseIndexingTaskSchema } from "../types/schemas";
import { useMultiTaggerImport } from "../utils/Hooks/MultiTaggerHooks";
export default function Home() {
  const [navMenuOpen, setNavMenuOpen] = useState(true);
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
  const onClickNavigationHandler = () => setNavMenuOpen((prev) => !prev);
  return (
    <Stack margin={"10"}>
      <header>
        <h1 className="text-center">Pdf Management App</h1>
        <button onClick={onClickNavigationHandler}>Navigation Menu</button>
      </header>
      <Stack direction={"row"}>
        {navMenuOpen && (
          <Navigation>
            <Link to="/browse">
              <span className="bg-amber-300">Browse Books</span>
            </Link>
            <Link to="/favorite">
              <span className="bg-blue-300">Favorite Books</span>
            </Link>
            <Link to="/unclassified">
              <span className="bg-green-300">Unclassified Books</span>
            </Link>
            <Link to="/multitagger">
              <span className="bg-red-300">Multi tagger</span>
            </Link>
            <Link to="/fts">
              <span className="bg-violet-300">Full-text Search</span>
            </Link>
          </Navigation>
        )}
        <Outlet />
        <Toaster />
      </Stack>
    </Stack>
  );
}
