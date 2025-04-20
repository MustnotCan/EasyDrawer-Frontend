import TagAdder from "./TagAdder";
import { menuProps } from "../types/types";
import { removeBookById, removeBookByName } from "../utils/queries/booksApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRevalidator } from "react-router-dom";
export default function Menu(props: menuProps) {
  const queryClient = useQueryClient();
  const { revalidate } = useRevalidator();
  const removeBookByIdMutation = useMutation({
    mutationFn: (id: string) => removeBookById(id),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["books"] });
      revalidate();
    },
    onError: (err) => {
      console.error("Error removing book by id:", err);
    },
  });
  const removeBooksByNameMutation = useMutation({
    mutationFn: (name: string) => removeBookByName(name),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["books"] });
      revalidate();
    },
    onError: (err) => {
      console.error("Error removing books by name:", err);
    },
  });
  return (
    <div
      style={{
        borderWidth: "5px",
        borderColor: "red",
        borderStyle: "solid",
      }}
      className="menu"
    >
      {" "}
      <button
        onClick={() => {
          removeBookByIdMutation.mutate(props.id);
          console.log("you are clicking me!");
        }}
      >
        remove this book
      </button>
      <button onClick={() => removeBooksByNameMutation.mutate(props.name)}>
        remove all books with this name
      </button>
      <button onClick={() => {}}>download this book</button>
      <TagAdder tags={props.tags} name={props.name} itemTags={props.itemTags} />
    </div>
  );
}
