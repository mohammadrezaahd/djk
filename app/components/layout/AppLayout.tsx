import React from "react";
import Layout from "./Layout";

interface LayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: LayoutProps) => {
  return <Layout>{children}</Layout>;
};

export default AppLayout;
