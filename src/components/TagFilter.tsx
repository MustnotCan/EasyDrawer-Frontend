import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { removeTag, renameTag } from "../utils/queries/tagsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRevalidator } from "react-router-dom";
import { tagType } from "../types/types";
export default function TagFilter(props: {
  tags: tagType[];
  setTFB: (arg0: string[]) => void;
}) {
  const [cBoxes, setCBoxes] = useState<string[]>([]);

  const onChangeHandler = (e: ChangeEvent) => {
    if (cBoxes?.includes(e.target.id)) {
      setCBoxes(cBoxes.filter((cb) => cb != e.target.id));
    } else {
      const box = cBoxes?.concat([e.target.id]);
      setCBoxes(box);
    }
  };
  const formAction = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.setTFB(cBoxes);
  };
  const clearFilter = () => setCBoxes([]);
  return (
    <div className="tagFilter">
      <form
        className="TagAdderForm"
        method="post"
        onSubmit={formAction}
        id="tagFilteringForm"
      >
        <label htmlFor="tags">Tags:</label>
        {props.tags.map((tag) => (
          <div key={tag.id}>
            <input
              type="checkbox"
              id={tag.name}
              name={tag.name}
              onChange={onChangeHandler}
              checked={cBoxes.includes(tag.name)}
            />
            <label>{tag.name}</label>
            <DeleteButton tagName={tag.name} />
            <RenameButton tagName={tag.name} />
          </div>
        ))}
        <button type="submit">Filter</button>
        <button type="submit" onClick={clearFilter}>
          Clear Filters
        </button>
      </form>
    </div>
  );
}
export function DeleteButton(prop: { tagName: string }) {
  const queryClient = useQueryClient();
  const { revalidate } = useRevalidator();
  const { mutate } = useMutation({
    mutationFn: (tag: { name: string }) => removeTag(tag),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["tags"] });
      revalidate();
    },
    onError: (err) => {
      console.error("Error removing tag:", err);
    },
  });
  const deleteTag = () => mutate({ name: prop.tagName });

  return <button onClick={deleteTag}>remove</button>;
}
export function RenameButton(prop: { tagName: string }) {
  const [renaming, setRenaming] = useState(false);
  const [newValue, setNewValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { revalidate } = useRevalidator();
  const { mutate } = useMutation({
    mutationFn: (newName: string) =>
      renameTag({ prevName: prop.tagName, newName: newName }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["tags"] });
      revalidate();
    },
    onError: (err) => {
      console.error("Error renaming tag:", err);
    },
  });
  const reNameTagOff: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setRenaming(true);
    console.log(inputRef.current);
    inputRef?.current?.focus();
  };
  const reNameTagOn: React.MouseEventHandler<HTMLButtonElement> = () => {
    console.log(newValue);
    mutate(newValue);
    setRenaming(false);
  };
  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [renaming]);
  return (
    <div>
      {!renaming && <button onClick={reNameTagOff}>rename</button>}
      {renaming && (
        <>
          <label>New tag name</label>
          <input
            onBlur={(e) => {
              setNewValue(e.currentTarget.value);
            }}
            defaultValue={prop.tagName}
            ref={inputRef}
          />
          <button onClick={reNameTagOn}>Done</button>
        </>
      )}
    </div>
  );
}
