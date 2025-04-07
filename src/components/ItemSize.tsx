export default function ItemSize(props: {
  setTake: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <form>
      <fieldset>
        <select
          onChange={(e) => props.setTake(Number.parseInt(e.target.value))}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
        </select>
      </fieldset>
    </form>
  );
}
