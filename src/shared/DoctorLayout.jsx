import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "./Header";
import Footer from "./Footer";

export default function DoctorLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  // Redirect to login if not authenticated or not a doctor
  if (!user ) {
    return <Navigate to="/login" replace />;
  }

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
