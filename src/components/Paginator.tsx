export default function Paginator(props: {
  setPn: React.Dispatch<React.SetStateAction<number>>;
  count: number;
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
      {[...Array(props.count)].map((_, index) => (
        <h1 key={index} onClick={() => props.setPn(index + 1)}>
          {index + 1}
        </h1>
      ))}
    </div>
  );
}
