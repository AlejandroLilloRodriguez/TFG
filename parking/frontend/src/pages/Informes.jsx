import { useEffect, useState } from "react";
import { api } from "../api/Cliente";
import { useNavigate } from "react-router-dom";
import "./css/Informes.css";

export default function Informes() {
  const [informes, setInformes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function cargarInformes() {
      setCargando(true);
      setError(null);
      try {
        const res = await api.get("/api/informes/");
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        console.log("INFORMES:", data);
        setInformes(data);
      } catch (err) {
        console.log(err);
        setError("Error al cargar los informes");
      } finally {
        setCargando(false);
      }
    }

    cargarInformes();
  }, []);

  function verDetalle(id) {
    if (!id) return;
    navigate(`/informes/${id}`);
  }

  return (
    <div className="informes-container">
      <h1>Informes</h1>

      {cargando && <p>Cargando informes...</p>}
      {error && <p className="mensaje-error">{error}</p>}

      {!cargando && !error && (
        <>
          {informes.length === 0 ? (
            <p>No hay informes disponibles.</p>
          ) : (
            <div className="informes-grid">
              {informes.map((informe) => (
                <div
                  key={informe.id}
                  className="informe-card"
                  onClick={() => verDetalle(informe.id)}
                >
                  <h2>{informe.username}</h2>
                  <p>ID: {informe.id}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}