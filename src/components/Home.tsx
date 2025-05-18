import { Stack } from "@chakra-ui/react";
import Navigation from "./Navigation";
import { useState } from "react";

import { Link, Outlet } from "react-router-dom";

export default function Home() {
  const [navMenuOpen, setNavMenuOpen] = useState(true);

  const onClickNavigationHandler = () => setNavMenuOpen((prev) => !prev);
  return (
    <Stack margin={"10"}>
      <header>
        <h1 className="text-center">Pdf Management App</h1>
        <button onClick={onClickNavigationHandler}>Navigation Menu</button>
      </header>
      <Stack direction={"row"}>
        {navMenuOpen && (
          <Navigation>
            <Link to="/browse">
              <span className="bg-amber-300">Browse Books</span>
            </Link>
            <Link to="/favorite">
              <span className="bg-blue-300">Favorite Books</span>
            </Link>
            <Link to="/unclassified">
              <span className="bg-green-300">Unclassified Books</span>
            </Link>
            <Link to="/multitagger">
              <span className="bg-red-300">Multi tagger</span>
            </Link>
          </Navigation>
        )}
        <Outlet />
      </Stack>
    </Stack>
  );
}
