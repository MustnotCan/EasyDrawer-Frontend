export default function SearchBar() {
  return (
    <search>
      <form action="">
        <label htmlFor="searchInput">Filter Books: </label>
        <input type="search" id="searchInput" />
        <button type="submit">Search</button>
      </form>
    </search>
  );
}
