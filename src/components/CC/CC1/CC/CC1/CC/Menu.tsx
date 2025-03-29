import { useState } from "react";
import { tagType } from "../../../../../../utils/queries/tagsApi";
import TagAdder from "./CC/TagAdder";

export default function Menu(props: {
  name: string;
  tags: tagType[];
  itemTags: tagType[];
}) {
  const [showTagsMenu, setShowTagsMenu] = useState(false);

  return (
    <div
      style={{
        borderWidth: "5px",
        borderColor: "red",
        borderStyle: "solid",
      }}
    >
      {" "}
      <button
        onClick={() => {
          setShowTagsMenu(true);
        }}
      >
        add Tag to book
      </button>
      <TagAdder tags={props.tags} name={props.name} itemTags={props.itemTags} />
    </div>
  );
}
