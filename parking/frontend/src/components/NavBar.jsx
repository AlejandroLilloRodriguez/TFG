import { useState } from "react";
import { Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";

import Login from "../pages/Login";
import Home from "../pages/Home";
import Simulador from "../pages/Simulador";
import Reservas from "../pages/MisReservas";
import Vehiculos from "../pages/Vehiculos";
import Solicitar from "../pages/SolicitarReservas";
import "./NavBar.css";

export default function AppLayout({ token, setToken }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  const closeMenu = () => setMenuOpen(false);
  const openMenu = () => setMenuOpen(true);

  const ProtectedPage = ({ children }) => {
    if (!token) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <div className="app">
      {!isLoginPage && menuOpen && (
        <div className="overlay" onClick={closeMenu}></div>
      )}

      {!isLoginPage && (
        <>
          <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
            <div className="sidebar-header">
              <h2 className="sidebar-title">Parking App</h2>
              <button onClick={closeMenu} className="close-button">
                ✕
              </button>
            </div>

            <nav className="sidebar-nav">
              <NavLink
                to="/"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                Inicio
              </NavLink>

              <NavLink
                to="/simulador"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                Simulador
              </NavLink>

              <NavLink
                to="/reservas"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                Mis Reservas
              </NavLink>

              <NavLink
                to="/vehiculos"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                Mis Vehículos
              </NavLink>

              <NavLink
                to="/solicitar"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                Solicitar Reserva
              </NavLink>
            </nav>
          </aside>

          <header className="topbar">
            <div className="topbar-left">
              <button onClick={openMenu} className="menu-button">
                ☰
              </button>
            </div>

            <div className="status-box">
              {token ? "Usuario autenticado" : "Invitado"}
            </div>
          </header>
        </>
      )}

      <main className={isLoginPage ? "content login-content" : "content"}>
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />

          <Route
            path="/"
            element={
              <ProtectedPage>
                <Home />
              </ProtectedPage>
            }
          />

          <Route
            path="/simulador"
            element={
              <ProtectedPage>
                <Simulador />
              </ProtectedPage>
            }
          />

          <Route
            path="/reservas"
            element={
              <ProtectedPage>
                <Reservas />
              </ProtectedPage>
            }
          />

          <Route
            path="/vehiculos"
            element={
              <ProtectedPage>
                <Vehiculos />
              </ProtectedPage>
            }
          />

          <Route
            path="/solicitar"
            element={
              <ProtectedPage>
                <Solicitar />
              </ProtectedPage>
            }
          />
        </Routes>
      </main>
    </div>
  );
}