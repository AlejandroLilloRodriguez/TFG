import { useEffect, useState } from "react";
import { api } from "../api/Cliente";

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
      setMarca("");
      setModelo("");

      
      await cargarVehiculos();
    } catch (err) {
      console.log("Error");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="vehiculos-container">
      <h1>Mis Vehículos</h1>

      {cargando && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="crear-vehiculo">
        <h2>Registrar Nuevo Vehículo</h2>

        <input
          type="text"
          placeholder="Matrícula"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value.toUpperCase())}
        />
    
        <button onClick={crearVehiculos} disabled={cargando || !matricula}>
          Registrar Vehículo
        </button>
      </div>

      {!cargando && !error && vehiculos.length === 0 && (
        <p>No tienes vehículos registrados.</p>
      )}

      {!cargando && !error && vehiculos.length > 0 && (
        <ul>
          {vehiculos.map((v) => (
            <li key={v.id}>
              <p><strong>Matrícula:</strong> {v.matricula}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
