import React from "react";
import ErrorPage from "./ErrorPage";

interface NotFoundPageProps {
  title?: string;
  subtitle?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
}

const NotFoundPage: React.FC<NotFoundPageProps> = (props) => {
  return <ErrorPage errorCode={404} {...props} />;
};

export default NotFoundPage;
