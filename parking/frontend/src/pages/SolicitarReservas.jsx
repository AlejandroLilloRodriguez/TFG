import { useState, useEffect } from "react";
import { api } from "../api/Cliente";
import "./css/Solicitarresevas.css";

export default function SolicitarReservas() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [vehiculos, setVehiculos] = useState([]);
  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    async function cargarVehiculos() {
      try {
        const res = await api.get("/api/vehiculos/");
        setVehiculos(res.data);
      } catch (err) {
        console.log(err.response);
      }
    }

    cargarVehiculos();
  }, []);

  async function solicitarReserva() {
    setCargando(true);
    setRespuesta(null);

    if (!fechaInicio || !fechaFinal || !vehiculo) {
      setRespuesta({
        tipo: "error",
        mensaje: "Todos los campos son obligatorios",
      });
      setCargando(false);
      return;
    }

    if (new Date(fechaFinal) <= new Date(fechaInicio)) {
      setRespuesta({
        tipo: "error",
        mensaje: "La fecha final debe ser posterior a la fecha inicial",
      });
      setCargando(false);
      return;
    }

    try {
      const res = await api.post("/api/reservas/", {
        fechaInicio: new Date(fechaInicio).toISOString(),
        fechaFinal: new Date(fechaFinal).toISOString(),
        vehiculo: Number(vehiculo),
      });

      setRespuesta({
        tipo: "ok",
        mensaje: "Reserva creada correctamente",
        data: res.data,
      });
    } catch (err) {
      console.log(err.response);
      setRespuesta({
        tipo: "error",
        mensaje:
          err.response?.data?.detail ||
          "Error al crear la reserva",
        data: err.response?.data,
      });
    }

    setCargando(false);
  }

  return (
    <section className="solicitud-page">
      <div className="solicitud-hero">
        <span className="solicitud-badge">Panel de solicitudes</span>
        <h1 className="solicitud-title">Solicitar Reserva</h1>
        <p className="solicitud-description">
          Crea una nueva reserva indicando el intervalo de tiempo y el vehículo
          asociado.
        </p>
      </div>

      <div className="solicitud-card">
        <div className="solicitud-form-header">
          <span className="solicitud-form-badge">Nueva reserva</span>
          <h2>Completa los datos</h2>
          <p>
            Introduce la fecha de inicio, la fecha de finalización y selecciona
            el vehículo asociado.
          </p>
        </div>

        <div className="solicitud-form">
          <div className="solicitud-grid">
            <div className="solicitud-input-group">
              <label htmlFor="fechaInicio">Fecha de inicio</label>
              <input
                id="fechaInicio"
                type="datetime-local"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>

            <div className="solicitud-input-group">
              <label htmlFor="fechaFinal">Fecha de finalización</label>
              <input
                id="fechaFinal"
                type="datetime-local"
                value={fechaFinal}
                onChange={(e) => setFechaFinal(e.target.value)}
              />
            </div>
          </div>

          <div className="solicitud-input-group">
            <label htmlFor="vehiculo">Vehículo (matrícula)</label>
            <select
              id="vehiculo"
              value={vehiculo}
              onChange={(e) => setVehiculo(e.target.value)}
            >
              <option value="">Selecciona un vehículo</option>
              {vehiculos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.matricula}
                </option>
              ))}
            </select>
          </div>

          <button
            className="solicitud-submit-button"
            onClick={solicitarReserva}
            disabled={cargando}
          >
            {cargando ? "Procesando solicitud..." : "Solicitar reserva"}
          </button>
        </div>
      </div>

      {respuesta && (
        <div
          className={`solicitud-response ${
            respuesta.tipo === "error"
              ? "solicitud-response-error"
              : "solicitud-response-success"
          }`}
        >
          <div className="solicitud-response-header">
            <span className="solicitud-response-badge">
              {respuesta.tipo === "error" ? "Error" : "Solicitud completada"}
            </span>
            <h3>{respuesta.mensaje}</h3>
          </div>

          {respuesta.tipo === "error" ? (
            <p className="solicitud-response-text">{respuesta.mensaje}</p>
          ) : (
            <div className="solicitud-response-content">
              <p className="solicitud-response-text">
                La reserva se ha registrado correctamente.
              </p>

              <div className="solicitud-json-box">
                <pre>{JSON.stringify(respuesta.data, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}