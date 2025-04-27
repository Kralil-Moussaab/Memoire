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
import AppointmentUser from "./pages/AppointmentUser";
import JewelsPage from "./pages/JewelsPage";
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
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
