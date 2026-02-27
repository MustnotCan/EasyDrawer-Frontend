import { Button, Span, Stack } from "@chakra-ui/react";
import { memo, ReactElement, useEffect, useState } from "react";
import TableOfContents from "./TOC";
import { LuTableOfContents } from "react-icons/lu";
import { Tooltip } from "../../../ui/tooltip";
import { useEngineContext } from "@embedpdf/engines/react";
import { PdfBookmarkObject } from "@embedpdf/models";
import {
  useActiveDocument,
  useDocumentManagerCapability,
} from "@embedpdf/plugin-document-manager/react";
import { AiOutlineEdit } from "react-icons/ai";
import AnnotationEditer from "./AnnotationEditer";
import UserBookMarks from "./UserBookmarks";
import { CiBookmark, CiSettings } from "react-icons/ci";
import Settings from "./Settings";
import { useScrollCapability } from "@embedpdf/plugin-scroll/react";
import AnnotationDefaults from "./AnnotationDefaults";

const TocMemo = memo(TableOfContents);

export default function Sidebar() {
  const { activeDocumentId } = useActiveDocument();
  const { engine, isLoading } = useEngineContext();
  const { provides: loaderApi } = useDocumentManagerCapability();
  const { provides: scrollApi } = useScrollCapability();
  const [bookmarks, setbookmarks] = useState<PdfBookmarkObject[]>([]);
  const [activeSideBar, setActiveSideBar] = useState("");

  useEffect(() => {
    if (!loaderApi || !engine || isLoading) return;

    return loaderApi.onDocumentOpened((state) => {
      engine
        .getBookmarks(state.document!)
        .toPromise()
        .then((bm) => setbookmarks(bm.bookmarks));
    });
  }, [loaderApi, engine, isLoading]);
  if (!activeDocumentId) return;
  const toggleOption = (opt: string) => {
    setActiveSideBar((prev) => (prev != opt ? opt : ""));
  };
  return (
    <Stack direction={"row"} background="#ffffff" width="fit">
      <Stack direction={"column"}>
        <SidebarButton
          tooltip={"Table of contents"}
          toggleOption={"TOC"}
          children={<LuTableOfContents />}
        />
        <SidebarButton
          tooltip={"Annotation editer"}
          toggleOption={"AE"}
          children={<AiOutlineEdit />}
        />
        <SidebarButton
          tooltip={"User bookmarks"}
          toggleOption={"UB"}
          children={<CiBookmark />}
        />
        <SidebarButton
          tooltip={"Viewer Settings"}
          toggleOption={"Settings"}
          children={<CiSettings />}
        />
        <SidebarButton
          tooltip={"Annotation defaults"}
          toggleOption={"AD"}
          children={<Span>AD</Span>}
        />
      </Stack>
      <Stack display={activeSideBar == "TOC" ? "block" : "none"}>
        <TocMemo bookmarks={bookmarks} scrollApi={scrollApi} />
      </Stack>
      {activeSideBar == "AE" && <AnnotationEditer />}
      {activeSideBar == "UB" && <UserBookMarks />}
      {activeSideBar == "Settings" && <Settings />}
      <Stack display={activeSideBar == "AD" ? "block" : "none"}>
        <AnnotationDefaults />
      </Stack>
    </Stack>
  );

  function SidebarButton(props: {
    children: ReactElement;
    toggleOption: string;
    tooltip: string;
  }) {
    return (
      <Button
        variant={"outline"}
        width={"2.5rem"}
        height={"2.5rem"}
        size={"2xs"}
        onClick={() => toggleOption(props.toggleOption)}
      >
        <Tooltip content={props.tooltip}>{props.children}</Tooltip>
      </Button>
    );
  }
}
