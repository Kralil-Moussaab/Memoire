import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./shared/Layout";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import FindDoctors from "./pages/FindDoctors";
import OnlineConsult from "./pages/OnlineConsult";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<AuthPage />} />
            <Route path="find" element={<FindDoctors />} />
            <Route path="consult" element={<OnlineConsult />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
