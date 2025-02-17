import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./shared/Layout"
import Home from "./pages/Home"
import AuthPage from "./pages/AuthPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<AuthPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
