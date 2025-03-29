import { useState } from "react";

export default function ItemSize() {
  const [pn, setPn] = useState(1);
  const [take, setTake] = useState(10);
  return (
    <form>
      <fieldset>
        <select onChange={(e) => setTake(Number.parseInt(e.target.value))}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
        </select>
      </fieldset>
    </form>
  );
}
