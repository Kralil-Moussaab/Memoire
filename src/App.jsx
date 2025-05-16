import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./shared/Layout";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import FindDoctors from "./pages/FindDoctors";
import OnlineConsult from "./pages/OnlineConsult";
import Profile from "./pages/Profile";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorLayout from "./shared/DoctorLayout";
import PatientsPage from "./pages/doctor/PatientsPage";
import AppointmentsPage from "./pages/doctor/AppointmentsPage";
import ProfilePage from "./pages/doctor/ProfilePage";
import ChatPage from "./pages/doctor/ChatPage";
import AppointmentUser from "./pages/AppointmentUser";
import JewelsPage from "./pages/JewelsPage";
import AdminLayout from "./shared/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminLogin from "./pages/admin/AdminLogin";
import { AdminProtectedRoute, AdminLoginRedirect } from "./pages/admin/AdminProtected";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<AuthPage />} />
              <Route path="find" element={<FindDoctors />} />
              <Route path="doctor/:id" element={<DoctorProfile />} />
              <Route path="consult" element={<OnlineConsult />} />
              <Route path="profile" element={<Profile />} />
              <Route path="myappointments" element={<AppointmentUser />} />
              <Route path="jewels" element={<JewelsPage />} />
            </Route>
            <Route path="/doctor" element={<DoctorLayout />}>
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="patients" element={<PatientsPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route element={<AdminLoginRedirect />}>
              <Route path="/admin-login" element={<AdminLogin />} />
            </Route>

            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="doctors" element={<AdminDoctors />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;