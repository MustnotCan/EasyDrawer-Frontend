import { Stack } from "@chakra-ui/react";
import Navigation from "./Navigation";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { SSE_URL } from "../utils/envVar";
import { Toaster, toaster } from "../ui/toaster";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const [navMenuOpen, setNavMenuOpen] = useState(true);
  const queryClient = useQueryClient();
  useEffect(() => {
    const eventSource = new EventSource(SSE_URL);
    eventSource.addEventListener("successImport", (event) => {
      const toastId = toaster.create({
        description: event.data,
        type: "success",
        closable: true,
        duration: 2000,
        action: {
          label: "X",
          onClick: () => toaster.dismiss(toastId),
        },
      });
    });
    eventSource.addEventListener("indexingSucceeded", (event) => {
      const toastId = toaster.create({
        type: "success",
        description: event.data,
        duration: 2000,
        closable: true,
        action: {
          label: "X",
          onClick: () => toaster.dismiss(toastId),
        },
      });
    });
    eventSource.addEventListener("indexingFailed", (event) => {
      const toastId = toaster.create({
        type: "error",
        description: event.data,
        duration: 2000,
        closable: true,
        action: {
          label: "X",
          onClick: () => toaster.dismiss(toastId),
        },
      });
    });
    eventSource.addEventListener("message", (event) => {
      const parsedEventBody = JSON.parse(event.data);
      if (
        parsedEventBody.type == "indexCreation" ||
        parsedEventBody.type == "indexDeletion"
      ) {
        queryClient.fetchQuery({ queryKey: ["indexes"] });
      }
      const toastId = toaster.create({
        description: <p className="max-w-60"> {event.data}</p>,
        type: "success",
        closable: true,
        duration: 2000,
        action: {
          label: "X",
          onClick: () => toaster.dismiss(toastId),
        },
      });
    });
    eventSource.onerror = function (error) {
      console.log("New error:", error);
    };
    return () => eventSource.close();
  }, [queryClient]);
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
