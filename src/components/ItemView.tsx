import Menu from "./Menu";
import { itemView } from "../types/types";
export default function ItemView(props: itemView) {
  return (
    <div className="divItemView">
      {
        <img
          className="thumbnailPdf"
          src={import.meta.env.VITE_API_IMAGES + props.prop.thumbnail}
          alt={props.prop.title}
        />
      }
      <div>
        {props.showFullName && (
          <div className="titlePdf">{props.prop.title}</div>
        )}
        <span>
          Liked?:{" "}
          {props.prop.tags
            .map((tag) => tag.name.toLowerCase())
            .includes("favorite")
            ? "Yes !"
            : "NO !"}
        </span>
        <Menu
          name={props.prop.title}
          tags={props.existingTags}
          itemTags={props.itemTags}
          id={props.prop.id}
          markForLater={props.prop.markForLater}
        />
      </div>
    </div>
  );
}
