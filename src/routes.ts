import { type RouteConfig, route } from "@react-router/dev/routes";
export default [
  route("/books", "components/App.tsx"),
  route("/", "components/Home.tsx"),
] satisfies RouteConfig;
