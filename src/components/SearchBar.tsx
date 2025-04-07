import { FormEvent } from "react";

export default function SearchBar({
  setSearchInput,
}: {
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleSearchByName = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fData = new FormData(e.currentTarget);
    const searchInput = fData.get("searchInput") || "";
    setSearchInput(searchInput.toString());
    console.log(searchInput);
  };
  return (
    <search>
      <form onSubmit={handleSearchByName}>
        <label htmlFor="searchInput">Search book by name: </label>
        <input type="search" name="searchInput" />
        <button type="submit">Search</button>
      </form>
    </search>
  );
}
