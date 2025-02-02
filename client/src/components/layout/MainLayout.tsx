import Header from "./Header";
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div className="bg-background dark:bg-dark-background text-gray-800 dark:text-gray-100 min-h-screen">
      <Header />
      <main className="p-4 pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
