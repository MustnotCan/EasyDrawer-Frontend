import { removeTag } from "../../utils/queries/tagsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IconButton } from "@chakra-ui/react";
import { DeleteOutlined } from "@ant-design/icons";
import { tagType } from "@/types/types";
export function DeleteButton(prop: { tagName: string }) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (tag: { name: string }) => removeTag(tag),
    onSuccess: (deletedTag: tagType) => {
      queryClient.setQueryData(["tags"], (oldTags: tagType[]) => {
        if (!oldTags) return [];
        return [...oldTags.filter((tag) => tag.name !== deletedTag.name)];
      });
    },
    onError: (err) => {
      console.error("Error removing tag:", err);
    },
  });
  const deleteTag = () => mutate({ name: prop.tagName });

  return (
    <IconButton variant={"ghost"} size={"sm"} onClick={deleteTag}>
      <DeleteOutlined />
    </IconButton>
  );
}
