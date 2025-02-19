import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <main className="flex-1 mt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
