import { importFiles } from "../../utils/queries/booksApi";
import { Button, FileUpload, Stack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { HiSave, HiUpload } from "react-icons/hi";

export function MultiTaggerImport(props: { dirs: string[] }) {
  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<File[]>([]);
  const importMutation = useMutation({
    mutationFn: (args: { dirs: string; files: File[] }) => {
      return importFiles({ dir: args.dirs, files: args.files });
    },
    onSuccess: () => {
      setFiles([]);
      setFolders([]);
    },
  });

  return (
    <Stack direction={"column"} marginLeft={"1rem"} marginTop={"1rem"}>
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
            <Button variant="outline" size="sm" margin={0}>
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
                    importMutation.mutate({
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
                    importMutation.mutate({
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
