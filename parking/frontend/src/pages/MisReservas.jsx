import { useEffect, useState } from "react";
import { api } from "../api/Cliente";
import "./css/MisReservas.css";

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [fechaInicioFiltro, setFechaInicioFiltro] = useState("");
  const [fechaFinFiltro, setFechaFinFiltro] = useState("");

  async function cargarReservas() {
    setCargando(true);
    setError(null);

    try {
      let url = "/api/reservas/";
      const params = [];

      if (fechaInicioFiltro) {
        params.push(`fecha_inicio=${fechaInicioFiltro}`);
      }

      if (fechaFinFiltro) {
        params.push(`fecha_fin=${fechaFinFiltro}`);
      }

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const res = await api.get(url);
      setReservas(res.data);
    } catch (err) {
      console.log(err);
      setError("Error al cargar reservas");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarReservas();
  }, []);

  async function cancelarReserva(id) {
    setCargando(true);
    setError(null);

    try {
      await api.post(`/api/reservas/${id}/cancelar/`);
      await cargarReservas();
    } catch (err) {
      console.log(err);
      setError("Error al cancelar reserva");
      setCargando(false);
    }
  }

  function limpiarFiltros() {
    setFechaInicioFiltro("");
    setFechaFinFiltro("");
  }

  function puedeCancelar(estado) {
    return estado === "PENDIENTE" || estado === "ASIGNADA";
  }

  function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <section className="reservas-page">
      <div className="reservas-hero">
        <span className="reservas-badge">Panel de reservas</span>
        <h1 className="reservas-title">Mis Reservas</h1>
        <p className="reservas-description">
          Consulta el estado de tus reservas, revisa horarios y cancela aquellas
          que todavía estén activas.
        </p>
      </div>

            <div className="reservas-filtros">
                <div className="filtro-item">
                    <label>Desde</label>
                    <input
                    type="date"
                    value={fechaInicioFiltro}
                    onChange={(e) => setFechaInicioFiltro(e.target.value)}
                    />
                </div>

                <div className="filtro-item">
                    <label>Hasta</label>
                    <input
                    type="date"
                    value={fechaFinFiltro}
                    onChange={(e) => setFechaFinFiltro(e.target.value)}
                    />
                </div>

                <div className="filtro-botones">
                    <button className="filtrar-button" onClick={cargarReservas}>
                    Filtrar
                    </button>

                    <button
                    className="limpiar-button"
                    onClick={() => {
                        setFechaInicioFiltro("");
                        setFechaFinFiltro("");
                    }}
                    >
                    Limpiar
                    </button>
                </div>
        </div>

      {cargando && (
        <div className="reservas-message">
          <p>Cargando reservas...</p>
        </div>
      )}

      {error && (
        <div className="reservas-message reservas-error">
          <p>{error}</p>
        </div>
      )}

      {!cargando && !error && reservas.length === 0 && (
        <div className="reservas-empty">
          <h2>No tienes reservas</h2>
          <p>
            Cuando realices una reserva, aparecerá aquí con su estado, plaza y
            horario.
          </p>
        </div>
      )}

      {!cargando && !error && reservas.length > 0 && (
        <div className="reservas-grid">
          {reservas.map((reserva) => (
            <article className="reserva-card" key={reserva.id}>
              <div className="reserva-card-top">
                <div>
                  <p className="reserva-label">Plaza</p>
                  <h3 className="reserva-plaza">{reserva.plaza ?? "Sin asignar"}</h3>
                </div>
              </div>

              <div className="reserva-info">
                <div className="reserva-info-item">
                  <span className="info-label">Entrada</span>
                  <p>{formatearFecha(reserva.fechaInicio)}</p>
                </div>

                <div className="reserva-info-item">
                  <span className="info-label">Salida</span>
                  <p>{formatearFecha(reserva.fechaFinal)}</p>
                </div>

                <div className="reserva-info-item">
                  <span className="info-label">Estado</span>
                  <p>{reserva.estado}</p>
                </div>

                <div className="reserva-info-item">
                  <span className="info-label">Usuario</span>
                  <p>{reserva.usuario}</p>
                </div>
              </div>

              {puedeCancelar(reserva.estado) && (
                <div className="reserva-actions">
                  <button
                    className="cancelar-button"
                    onClick={() => cancelarReserva(reserva.id)}
                  >
                    Cancelar reserva
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}