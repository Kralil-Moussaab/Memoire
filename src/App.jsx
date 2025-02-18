import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./shared/Layout"
import Home from "./pages/Home"
import AuthPage from "./pages/AuthPage";
import FindDoctors from "./pages/FindDoctors"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<AuthPage />} />
          <Route path="find" element={<FindDoctors />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
