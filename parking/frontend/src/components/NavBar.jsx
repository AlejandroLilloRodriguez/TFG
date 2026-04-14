import { useState } from "react";
import { Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";

import Login from "../pages/Login";
import Home from "../pages/Home";
import Simulador from "../pages/Simulador";
import Reservas from "../pages/MisReservas";
import Vehiculos from "../pages/Vehiculos";
import Solicitar from "../pages/Solicitarreservas";
import PanelAdmin from "../pages/PanelAdmin";
import Informes from "../pages/Informes";
import DetalleInforme from "../pages/DetalleInforme";
import "./NavBar.css";

export default function AppLayout({ token, setToken, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  console.log("Rol del usuario:", user?.rol);

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
              {user?.rol === "CLIENTE" && (  
              <NavLink
                to="/solicitar"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                Solicitar Reserva
              </NavLink>
              )}
              {user?.rol === "ADMIN" && (
                <NavLink
                  to="/admin"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive ? "nav-link active-link" : "nav-link"
                  }
                >
                  Panel de Administración
                </NavLink>
              )}
              <NavLink
                to="/informes"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                Informes
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
          {user?.rol === "ADMIN" && (
            <Route
              path="/admin"
              element={
                <ProtectedPage>
                  <PanelAdmin />
                </ProtectedPage>
              }
            />

          )}
          <Route
            path="/informes"
            element={
              <ProtectedPage>
                <Informes />
              </ProtectedPage>
            }
          />
          <Route
            path="/informes/:id"
            element={
              <ProtectedPage>
                <DetalleInforme />
              </ProtectedPage>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}