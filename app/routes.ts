import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/home.tsx"),
  route("/auth", "pages/auth.tsx"),
  route("/templates/new", "pages/templates/new.tsx"),
  route("/templates/list", "pages/templates/list.tsx"),
  route("/templates/edit", "pages/templates/edit.tsx"),
  route("/gallery", "pages/gallery.tsx"),
] satisfies RouteConfig;
