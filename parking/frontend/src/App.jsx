import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Ping from "./pages/Ping";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Simulador from "./pages/Simulador";

function Index() {
  const token = localStorage.getItem("access_token");
  if (token) {
    return <Home />;
  } else {
    return <Login />;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 16, fontFamily: "system-ui" }}>
        <h1>Parking App</h1>

        <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <Link to="/">Home</Link>
          <Link to="/ping">Ping</Link>
          <Link to="/login">Login</Link>
          <Link to="/simulador">Simulador</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Index/>} />
          <Route path="/ping" element={<Ping />} />
          <Route path="/login" element={<Login />} />
          <Route path="/simulador" element={<Simulador />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
