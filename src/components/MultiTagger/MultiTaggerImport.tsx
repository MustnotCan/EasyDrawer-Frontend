import { itemViewProps } from "../../types/types";
import { importFiles } from "../../utils/queries/booksApi";
import { Button, FileUpload, Stack } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { HiSave, HiUpload } from "react-icons/hi";

export function MultiTaggerImport(props: { dirs: string[] }) {
  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<File[]>([]);
  const queryClient = useQueryClient();
  const fileMutation = useMutation({
    mutationKey: ["multiTaggerFileImport"],
    mutationFn: (args: { dirs: string; files: File[] }) => {
      return importFiles({ dir: args.dirs, files: args.files });
    },
    onSuccess: (addedFiles: itemViewProps[]) => {
      setFiles([]);
      queryClient.setQueryData(
        ["Dirs&files", props.dirs],
        (prev: (string | itemViewProps)[]) => {
          const existingFiles = prev
            .filter((file) => !(typeof file == "string"))
            .map((file) => file.title);
          return [
            ...prev,
            ...addedFiles.filter((file) => !existingFiles.includes(file.title)),
          ];
        }
      );
    },
  });
  const folderMutation = useMutation({
    mutationKey: ["multiTaggerFolderImport"],
    mutationFn: (args: { dirs: string; files: File[] }) => {
      console.log(args.files);
      return importFiles({ dir: args.dirs, files: args.files });
    },
    onSuccess: (
      addedFiles: itemViewProps[],
      variables: { dirs: string; files: File[] }
    ) => {
      setFolders([]);
      queryClient.setQueryData(
        ["Dirs&files", props.dirs],
        (prev: (string | itemViewProps)[]) => {
          const newFolders: string[] = [];
          const nbrSlashesInDir = props.dirs.length;
          addedFiles.forEach((file) => {
            const newFolder = file.path.split("/").at(nbrSlashesInDir);
            if (newFolder && !newFolders.includes(newFolder))
              newFolders.push(newFolder);
          });
          const existingFolders = prev
            .filter((file) => typeof file == "string")
            .map((file) => file);
          return [
            ...prev,
            ...newFolders.filter((file) => !existingFolders.includes(file)),
          ];
        }
      );
      variables.files.forEach((file) => {
        const splittedPath = [
          ...props.dirs,
          file.webkitRelativePath.split("/")[0],
        ];
        queryClient.setQueryData(
          ["Dirs&files", splittedPath],
          (prev: (string | itemViewProps)[] | undefined) => {
            if (prev) {
              if (
                prev.find(
                  (item) =>
                    typeof item != "string" &&
                    item.title == file.webkitRelativePath.split("/")[1]
                )
              )
                return [...prev];
              return [
                ...prev,
                addedFiles.find(
                  (item) => item.title == file.webkitRelativePath.split("/")[1]
                ),
              ];
            } else {
              return [
                addedFiles.find(
                  (item) => item.title == file.webkitRelativePath.split("/")[1]
                ),
              ];
            }
          }
        );
      });
    },
  });
  return (
    <Stack direction={"column"} width={"200px"}>
      <FileUpload.Root
        maxFiles={Infinity}
        accept={"application/pdf"}
        onFileAccept={(e) => {
          const filesToImport: File[] = [];
          e.files.forEach((file) => {
            if (
              files.filter(
                (fl) =>
                  fl.name == file.name &&
                  fl.webkitRelativePath == file.webkitRelativePath
              ).length == 0
            ) {
              filesToImport.push(file);
            }
          });
          setFiles((prev) => [...prev, ...filesToImport]);
        }}
      >
        <FileUpload.HiddenInput />
        <Stack direction={"row"}>
          <FileUpload.Trigger asChild>
            <Button variant="outline" size="sm" margin={"0px"}>
              <HiUpload /> Select file
            </Button>
          </FileUpload.Trigger>
          {files.length > 0 && (
            <FileUpload.ClearTrigger asChild>
              <Stack direction={"row"}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiles([])}
                >
                  <HiSave /> clear files
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    fileMutation.mutate({
                      dirs: props.dirs.join("/"),
                      files: files,
                    })
                  }
                >
                  <HiSave /> Upload file ({files.length})
                </Button>
              </Stack>
            </FileUpload.ClearTrigger>
          )}
        </Stack>
      </FileUpload.Root>

      <FileUpload.Root
        directory={true}
        accept={"application/pdf"}
        onFileAccept={(e) => {
          const filesToImport: File[] = [];
          e.files.forEach((file) => {
            if (
              folders.filter(
                (fl) =>
                  fl.name == file.name &&
                  fl.webkitRelativePath == file.webkitRelativePath
              ).length == 0
            ) {
              filesToImport.push(file);
            }
          });
          setFolders((prev) => [...prev, ...filesToImport]);
        }}
        maxFiles={Infinity}
      >
        <FileUpload.HiddenInput />
        <Stack direction={"row"}>
          <FileUpload.Trigger asChild>
            <Button variant="outline" size="sm">
              <HiUpload /> Upload folder
            </Button>
          </FileUpload.Trigger>
          {folders.length > 0 && (
            <FileUpload.ClearTrigger asChild>
              <Stack direction={"row"}>
                {" "}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFolders([])}
                >
                  <HiSave /> clear Folders
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    folderMutation.mutate({
                      dirs: props.dirs.join("/"),
                      files: folders,
                    })
                  }
                >
                  <HiSave /> Upload Folders ({folders.length} files )
                </Button>
              </Stack>
            </FileUpload.ClearTrigger>
          )}
        </Stack>
      </FileUpload.Root>
    </Stack>
  );
}
