import { useState } from "react";
import { api } from "../api/Cliente";
import "./css/Simulador.css";

export default function Simulador() {
    const [matricula, setMatricula] = useState("");
    const [fecha, setFecha] = useState("");
    const [respuesta, setRespuesta] = useState(null);
    const [cargando, setCargando] = useState(false);
    async function entrada() {
      setCargando(true);
      setRespuesta(null);
      try {
        const res = await api.post("/api/lecturas/entrada/", {
          matricula: matricula,
          fecha: fecha,
        });

        setRespuesta({
          tipo: "ok",
          accion: "entrada",
          data: res.data,
        });
      } catch (err) {
        console.log(err.response);
        setRespuesta({
          tipo: "error",
          accion: "entrada",
          data: err.response?.data ?? { error: err.message },
        });
      }
  setCargando(false);
}
    async function salida() {
      setCargando(true);
      setRespuesta(null);
      try {
        const res = await api.post("/api/lecturas/salida/", {
          matricula: matricula,
          fecha: fecha,
        });

        setRespuesta({
          tipo: "ok",
          accion: "salida",
          data: res.data,
        });
      } catch (err) {
        console.log(err.response);
        setRespuesta({
          tipo: "error",
          accion: "salida",
          data: err.response?.data ?? { error: err.message },
        });
  }
  setCargando(false);
}
    return (
    <section className="simulador-page">
      <div className="simulador-hero">
        <span className="simulador-badge">Panel de simulación</span>
        <h1 className="simulador-title">Simulador de Entrada y Salida</h1>
        <p className="simulador-description">
          Prueba el flujo de acceso de vehículos introduciendo una matrícula y
          simulando su entrada o salida del parking.
        </p>
      </div>

      <div className="simulador-card">
        <div className="simulador-form-header">
          <span className="simulador-form-badge">Control de accesos</span>
          <h2>Simular lectura de matrícula</h2>
          <p>
           Introduce una matrícula y una fecha para ejecutar una simulación de
            entrada o de salida.
          </p>
        </div>

        <div className="simulador-form">
          <div className="simulador-input-group">
            <label htmlFor="matricula">Matrícula</label>
            <input
              id="matricula"
              type="text"
              placeholder="Ej. 1234ABC"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value.toUpperCase())}
            />
          </div>
          <div className="simulador-input-group">
            <label htmlFor="fecha">Fecha y hora</label>
            <input
              id="fecha"
              type="datetime-local"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>


          <div className="simulador-buttons">
            <button
              className="simulador-primary-button"
              onClick={entrada}
              disabled={cargando || !matricula.trim()}
            >
              Simular entrada
            </button>

            <button
              className="simulador-secondary-button"
              onClick={salida}
              disabled={cargando || !matricula.trim()}
            >
              Simular salida
            </button>
          </div>
        </div>
      </div>

      {cargando && (
        <div className="simulador-message">
          <p>Procesando simulación...</p>
        </div>
      )}

      {respuesta && (
        <div
          className={`simulador-response ${
            respuesta.tipo === "error"
              ? "simulador-response-error"
              : "simulador-response-success"
          }`}
        >
          <div className="simulador-response-header">
            <span className="simulador-response-badge">
              {respuesta.tipo === "error" ? "Error" : "Simulación completada"}
            </span>

            <h3>
              {respuesta.tipo === "error"
                ? `No se pudo simular la ${respuesta.accion}`
                : `Simulación de ${respuesta.accion} realizada correctamente`}
            </h3>
          </div>

          {respuesta.tipo === "error" ? (
            <p className="simulador-response-text">
              {respuesta.data?.error ||
                respuesta.data?.detail ||
                "Ha ocurrido un error inesperado."}
            </p>
          ) : (
            <div className="simulador-response-content">
              <p className="simulador-response-text">
                La operación se ha ejecutado correctamente.
              </p>

              <div className="simulador-json-box">
                <pre>{JSON.stringify(respuesta.data, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
    );
}