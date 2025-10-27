import Dashboard from "~/components/Dashboard";
import AppLayout from "~/components/layout/AppLayout";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const Home = () => {
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
};

export default Home;
