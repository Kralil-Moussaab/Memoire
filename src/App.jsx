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
            </Route>
            <Route path="/doctor" element={<DoctorLayout />}>
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
