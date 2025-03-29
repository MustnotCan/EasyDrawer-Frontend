import { NavLink } from "react-router-dom";

export default function Paginator(props: { count: number; take: number }) {
  return (
    <div
      className="pageIndex"
      style={{
        display: "flex",
        justifyContent: "space-between",
        maxWidth: "20rem",
      }}
    >
      {" "}
      {[...Array(props.count)].map((_, index) => (
        <NavLink
          key={index}
          to={`/books/?take=${props.take}&pn=${index + 1}`}
          reloadDocument
        >
          {index + 1}
        </NavLink>
      ))}
    </div>
  );
}
