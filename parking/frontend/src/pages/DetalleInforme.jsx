import { useEffect, useState } from "react";
import { api } from "../api/Cliente";
import { useParams, useNavigate } from "react-router-dom";

export default function DetalleInforme() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [informe, setInforme] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setCargando(false);
      return;
    }

    async function cargarInforme() {
      setCargando(true);
      setError(null);
      try {
        const res = await api.get(`/api/informes/${id}/`);
        setInforme(res.data);
      } catch (err) {
        console.log(err);
        setError("Error al cargar el informe");
      } finally {
        setCargando(false);
      }
    }

    cargarInforme();
  }, [id]);

  return (
    <div className="detalle-informe-container">
      <h1>Detalle del Informe</h1>

      {cargando && <p>Cargando informe...</p>}
      {error && <p className="mensaje-error">{error}</p>}

      {!cargando && !error && informe && (
        <div className="detalle-informe-card">
          <h2>{informe.username}</h2>

          <p>
            <strong>ID usuario:</strong> {informe.id}
          </p>

          <p>
            <strong>Total reservas:</strong> {informe.totalReservas}
          </p>

          <p>
            <strong>Reservas usadas:</strong> {informe.reservasUsadas}
          </p>

          <p>
            <strong>No-shows:</strong> {informe.noshows}
          </p>

          <p>
            <strong>Porcentaje de uso:</strong> {informe.porcentajeDeUso}%
          </p>

          <button onClick={() => navigate("/informes")}>
            Volver a informes
          </button>
        </div>
      )}
    </div>
  );
}