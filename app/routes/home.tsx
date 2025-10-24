import { Welcome } from "../welcome/welcome";
import { useMemo } from "react";
import { categoriesApi } from "~/api/categories.api";
import { ApiStatus } from "~/types";
import Dashboard from "~/components/Dashboard";
import AppLayout from "~/components/AppLayout";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  useMemo(() => {
    const fetchCategories = async () => {
      const res = await categoriesApi.getCategories(77);
      if (res.status === ApiStatus.TRUE && res.data) {
        const data = res.data;
        // console.log(data.item);
      }
    };
    fetchCategories();
  }, []);

  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}
