import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "components/Home.tsx", { id: "home-root" }, [
    route("/browse", "components/MainView.tsx", { id: "browse" }),
    route("/favorite", "components/MainView.tsx", { id: "home-favorite" }),
    route("/unclassified", "components/MainView.tsx", {
      id: "home-unclassified",
    }),
    route("/multitagger", "components/MultiTagger.tsx", { id: "multi-tagger" }),
  ]),
  route("/pdfreader/:path", "components/PdfReader.tsx"),
] satisfies RouteConfig;
