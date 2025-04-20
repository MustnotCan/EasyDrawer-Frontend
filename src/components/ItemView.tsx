import Menu from "./Menu";
import { itemView } from "../types/types";
export default function ItemView(props: {
  itemView: itemView;
  addToSelected: (item: string) => void;
  removeFromSelected: (item: string) => void;
  selected: boolean;
}) {
  let timer = 0;
  return (
    <div className="menu-container">
      {
        <img
          className="thumbnailPdf"
          src={import.meta.env.VITE_API_IMAGES + props.itemView.prop.thumbnail}
          alt={props.itemView.prop.title}
          onMouseDown={() => {
            timer = Date.now();
          }}
          onMouseUp={() => {
            if (Date.now() - timer > 500) {
              console.log("test");
              props.addToSelected(props.itemView.prop.title);
              timer = 0;
            }
          }}
        />
      }
      <div className="overlay">
        {props.itemView.showFullName && (
          <div className="titlePdf">{props.itemView.prop.title}</div>
        )}
        <span>
          Liked?:{" "}
          {props.itemView.prop.tags
            .map((tag) => tag.name.toLowerCase())
            .includes("favorite")
            ? "Yes !"
            : "NO !"}
        </span>
        <span>Am I selected? {props.selected == true ? "SIii" : "Nooo"}</span>
        <button className="menu_button">reveal menu</button>
        <Menu
          name={props.itemView.prop.title}
          tags={props.itemView.existingTags}
          itemTags={props.itemView.itemTags}
          id={props.itemView.prop.id}
          markForLater={props.itemView.prop.markForLater}
        />
      </div>
    </div>
  );
}
