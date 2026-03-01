import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import Ping from "./pages/Ping";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Simulador from "./pages/Simulador";
import Reservas from "./pages/MisReservas";
import Vehiculos from "./pages/Vehiculos";
import Solicitar from "./pages/SolicitarReserva";

function Index({ token }) {
  return token ? <Home /> : <Login />;
}

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    setToken(storedToken);
  }, []);

  return (
    <BrowserRouter>
      <div style={{ padding: 16, fontFamily: "system-ui" }}>
        <h1>Parking App</h1>

        <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/simulador">Simulador</Link>
          <Link to="/reservas">Mis Reservas</Link>
          <Link to="/vehiculos">Mis Vehículos</Link>
          <Link to="/solicitar">Solicitar Reserva</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Index token={token} />} />
          <Route
            path="/login"
            element={<Login setToken={setToken} />}
          />
          <Route
            path="/simulador"
            element={token ? <Simulador /> : <Login setToken={setToken} />}
          />
          <Route
            path="/reservas"
            element={token ? <Reservas /> : <Login setToken={setToken} />}
          />
          <Route
            path="/vehiculos"
            element={token ? <Vehiculos /> : <Login setToken={setToken} />}
          />
          <Route
            path="/solicitar"
            element={token ? <Solicitar /> : <Login setToken={setToken} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
