import React from "react";
import ProtectedRoute from "~/components/auth/ProtectedRoute";
import { Outlet } from "react-router";

export function meta() {
  return [{ title: "پنل مدیریت" }];
}

const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
};

export default ProtectedLayout;
