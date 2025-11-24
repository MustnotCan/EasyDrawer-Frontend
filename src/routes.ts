import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "components/Home.tsx", { id: "home-root" }, [
    route("/browse", "components/MainView.tsx", { id: "browse" }),
    route("/favorite", "components/MainView.tsx", { id: "home-favorite" }),
    route("/unclassified", "components/MainView.tsx", {
      id: "home-unclassified",
    }),
    route("/multitagger", "components/MultiTagger/MultiTagger.tsx", {
      id: "multi-tagger",
    }),
    route("/fts", "components/FullTextSearch/FullTextSearch.tsx"),
  ]),
  route("/pdfreader/:path/:page?", "components/pdfReader.tsx"),
] satisfies RouteConfig;
