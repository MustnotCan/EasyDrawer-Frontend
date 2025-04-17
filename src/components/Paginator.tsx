export default function Paginator(props: {
  setPn: React.Dispatch<React.SetStateAction<number>>;
  count: number;
  pn: number;
}) {
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
      {[...Array(props.count)].map((_, index) => {
        const updatedIndex = index + 1;
        return (
          <span
            key={updatedIndex}
            hidden={
              updatedIndex > props.pn + 5 || updatedIndex < props.pn
                ? true
                : false
            }
            className={updatedIndex == props.pn ? "IsPn" : "NotPn"}
            onClick={() => props.setPn(updatedIndex)}
          >
            {updatedIndex}
          </span>
        );
      })}
    </div>
  );
}
