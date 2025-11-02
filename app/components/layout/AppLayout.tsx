import React from "react";
import Layout from "./Layout";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AppLayout = ({ children, title }: LayoutProps) => {
  return <Layout title={title}>{children}</Layout>;
};

export default AppLayout;
