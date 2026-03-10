import { useEffect, useState } from "react";
import { api } from "../api/Cliente";
import "./css/Vehiculos.css";

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const [matricula, setMatricula] = useState("");

  async function cargarVehiculos() {
    setCargando(true);
    setError(null);
    try {
      const res = await api.get("/api/vehiculos/");
      setVehiculos(res.data);
    } catch (err) {
      console.log("ERROR cargar vehiculos:", err.response ?? err);
      setError(err.response?.data?.detail ?? "Error al cargar vehículos");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarVehiculos();
  }, []);

  async function crearVehiculos() {
    setCargando(true);
    setError(null);
    try {
      await api.post("/api/vehiculos/", {
        matricula,
      });
      await cargarVehiculos();


   
      setMatricula("");
      

      
      await cargarVehiculos();
    } catch (err) {
      console.log("Error");
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="vehiculos-page">
      <div className="vehiculos-hero">
        <span className="vehiculos-badge">Panel de vehículos</span>
        <h1 className="vehiculos-title">Mis Vehículos</h1>
        <p className="vehiculos-description">
          Registra y consulta los vehículos asociados a tu cuenta desde un panel
          más visual, cómodo y ordenado.
        </p>
      </div>

      {cargando && (
        <div className="vehiculos-message">
          <p>Cargando vehículos...</p>
        </div>
      )}

      {error && (
        <div className="vehiculos-message vehiculos-error">
          <p>{error}</p>
        </div>
      )}

      <div className="vehiculo-form-card">
        <div className="vehiculo-form-header">
          <span className="vehiculo-form-badge">Nuevo vehículo</span>
          <h2>Registrar vehículo</h2>
          <p>
            Añade una matrícula para vincular un nuevo vehículo a tu usuario.
          </p>
        </div>

        <div className="vehiculo-form">
          <div className="vehiculo-input-group">
            <label htmlFor="matricula">Matrícula</label>
            <input
              id="matricula"
              type="text"
              placeholder="Ej. 1234ABC"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value.toUpperCase())}
            />
          </div>

          <button
            className="vehiculo-submit-button"
            onClick={crearVehiculos}
            disabled={cargando || !matricula.trim()}
          >
            Registrar vehículo
          </button>
        </div>
      </div>

      {!cargando && !error && vehiculos.length === 0 && (
        <div className="vehiculos-empty">
          <h2>No tienes vehículos registrados</h2>
          <p>
            Cuando registres uno, aparecerá aquí con su matrícula y usuario
            asociado.
          </p>
        </div>
      )}

      {!cargando && !error && vehiculos.length > 0 && (
        <div className="vehiculos-grid">
          {vehiculos.map((v) => (
            <article className="vehiculo-card" key={v.id}>
              <div className="vehiculo-card-top">
                <div>
                  <p className="vehiculo-label">Matrícula</p>
                  <h3 className="vehiculo-matricula">{v.matricula}</h3>
                </div>

                <span className="vehiculo-chip">Vehículo</span>
              </div>

              <div className="vehiculo-info">
                <div className="vehiculo-info-item">
                  <span className="info-label">Usuario</span>
                  <p>
                    {v.usuario}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

