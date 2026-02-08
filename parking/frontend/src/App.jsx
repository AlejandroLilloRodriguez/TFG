import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Ping from "./pages/Ping";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 16, fontFamily: "system-ui" }}>
        <h1>Parking App</h1>

        <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <Link to="/">Inicio</Link>
          <Link to="/ping">Ping</Link>
          <Link to="/login">Login</Link>
        </nav>

        <Routes>
          <Route path="/" element={<div>Inicio (frontend listo)</div>} />
          <Route path="/ping" element={<Ping />} />
          <Route path="/login" element={<Login />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}
