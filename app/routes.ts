import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  // Public routes (غیر محافظت شده)
  route("/auth", "pages/auth.tsx"),
  route("/restricted", "pages/restricted.tsx"),

  // Protected routes (محافظت شده)
  layout("pages/protected-layout.tsx", [
    index("pages/home.tsx"),
    route("/templates/new", "pages/templates/new.tsx"),
    route("/templates/list", "pages/templates/list.tsx"),
    route("/templates/edit", "pages/templates/edit.tsx"),
    route("/gallery", "pages/gallery.tsx"),
    route("/products/new", "pages/products/new.tsx"),
    route("/products/list", "pages/products/list.tsx"),
    route("/products/edit/:id", "pages/products/edit.tsx"),
    route("/test", "pages/test.tsx"),
  ]),
] satisfies RouteConfig;
