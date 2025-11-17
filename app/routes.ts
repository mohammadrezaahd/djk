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
  index("pages/home.tsx"),
  // Protected routes (محافظت شده)
  layout("pages/protected-layout.tsx", [
    route("/dashboard", "pages/dashboard.tsx"),
    route("dashboard/templates/new", "pages/templates/new.tsx"),
    route("dashboard/templates/list", "pages/templates/list.tsx"),
    route("dashboard/templates/edit", "pages/templates/edit.tsx"),
    route("dashboard/gallery", "pages/gallery.tsx"),
    route("dashboard/products/new", "pages/products/new.tsx"),
    route("dashboard/products/list", "pages/products/list.tsx"),
    route("dashboard/products/edit/:id", "pages/products/edit.tsx"),
    route("/test", "pages/test.tsx"),
    route("/test-suggested-values", "pages/test-suggested-values.tsx"),
    // Coming Soon Pages
    route("dashboard/profile", "pages/profile.tsx"),
    route("dashboard/settings", "pages/settings.tsx"),
    route("dashboard/security", "pages/security.tsx"),
    route("dashboard/help", "pages/help.tsx"),
    route("dashboard/transportation", "pages/transportation.tsx"),
  ]),
] satisfies RouteConfig;
