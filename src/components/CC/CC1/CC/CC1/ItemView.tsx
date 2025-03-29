import { useState } from "react";
import Menu from "./CC/Menu";
import { tagType } from "../../../../../utils/queries/tagsApi";
export type itemViewProps = {
  title: string;
  thumbnail: string;
  path: string;
  tags: tagType[];
};
export default function ItemView(props: {
  prop: itemViewProps;
  showFullName: boolean;
  existingTags: tagType[];
  itemTags: tagType[];
}) {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  return (
    <div
      className="divItemView"
      onClick={() => {
        if (showMenu) {
          //setShowMenu(!showMenu);
        }
      }}
    >
      {!showMenu && (
        <img
          className="thumbnailPdf"
          src={import.meta.env.VITE_API_IMAGES + props.prop.thumbnail}
          alt={props.prop.title}
        />
      )}
      <div>
        {props.showFullName && (
          <div className="titlePdf">{props.prop.title}</div>
        )}
        {false && <button onClick={toggleMenu}>show menu</button>}
        <Menu
          name={props.prop.title}
          tags={props.existingTags}
          itemTags={props.itemTags}
        />
      </div>
    </div>
  );
}
