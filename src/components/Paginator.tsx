const maxValue = (pn: number, count: number, length: number) => {
  if ((pn <= 3 && count >= length) || count < length) {
    return [...Array(length)].map((_, index) => index + 1);
  } else if (count - pn <= 2 && count >= length) {
    return [...Array(length)].map((_, index) => count - index);
  } else {
    return [...Array(length)].map((_, index) => pn + (index - 2));
  }
};
export default function Paginator(props: {
  setPn: React.Dispatch<React.SetStateAction<number>>;
  count: number;
  pn: number;
}) {
  const plage = maxValue(props.pn, props.count, 5);
  const firstPage = () => {
    props.setPn(1);
  };
  const lastPage = () => {
    props.setPn(props.count);
  };

  return (
    <div className="pageIndex">
      {props.pn != 1 && <span onClick={firstPage}>First page</span>}
      {[...Array(props.count)].map((_, index) => {
        const updatedIndex = index + 1;
        return (
          plage.includes(updatedIndex) && (
            <span
              key={updatedIndex}
              className={updatedIndex == props.pn ? "IsPn" : "NotPn"}
              onClick={() => props.setPn(updatedIndex)}
            >
              {updatedIndex}
            </span>
          )
        );
      })}
      {props.pn != props.count && <span onClick={lastPage}>Last page</span>}
    </div>
  );
}
