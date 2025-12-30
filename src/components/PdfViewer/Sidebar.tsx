import { Button, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TableOfContents from "./Sidebars/TOC";
import { LuTableOfContents } from "react-icons/lu";
import { Tooltip } from "../../ui/tooltip";
import { useEngineContext } from "@embedpdf/engines/react";
import { PdfBookmarkObject } from "@embedpdf/models";
import {
  useActiveDocument,
  useDocumentManagerCapability,
} from "@embedpdf/plugin-document-manager/react";
import { AiOutlineEdit } from "react-icons/ai";
import AnnotationEditer from "./Sidebars/AnnotationEditer";
import UserBookMarks from "./Sidebars/UserBookmarks";
import { CiBookmark } from "react-icons/ci";
export default function Sidebar() {
  const { activeDocumentId } = useActiveDocument();
  const { engine, isLoading } = useEngineContext();
  const { provides: loaderApi } = useDocumentManagerCapability();
  const [bookmarks, setbookmarks] = useState<PdfBookmarkObject[]>([]);
  useEffect(() => {
    if (!loaderApi || !engine || isLoading) return;

    return loaderApi.onDocumentOpened((state) => {
      engine
        .getBookmarks(state.document!)
        .toPromise()
        .then((bm) => setbookmarks(bm.bookmarks));
    });
  }, [loaderApi, engine, isLoading]);
  const [activeSideBar, setActiveSideBar] = useState("");
  if (!activeDocumentId) return <p>document not loaded</p>;

  return (
    <Stack direction={"row"}>
      <Stack direction={"column"}>
        <Button
          variant={"outline"}
          size="sm"
          onClick={() =>
            setActiveSideBar((prev) => (prev != "TOC" ? "TOC" : ""))
          }
        >
          <Tooltip content="Table of contents">
            <LuTableOfContents />
          </Tooltip>
        </Button>
        <Button
          variant={"outline"}
          size="sm"
          onClick={() => setActiveSideBar((prev) => (prev != "AE" ? "AE" : ""))}
        >
          <Tooltip content="Annotation editer">
            <AiOutlineEdit />
          </Tooltip>
        </Button>
        <Button
          variant={"outline"}
          size="sm"
          onClick={() => setActiveSideBar((prev) => (prev != "UB" ? "UB" : ""))}
        >
          <Tooltip content="User bookmarks">
            <CiBookmark />
          </Tooltip>
        </Button>
      </Stack>
      {activeSideBar == "TOC" && <TableOfContents bookmarks={bookmarks} />}
      {activeSideBar == "AE" && <AnnotationEditer />}
      {activeSideBar == "UB" && <UserBookMarks />}
    </Stack>
  );
}
