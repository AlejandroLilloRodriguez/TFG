import { useState } from "react";
import { api } from "../api/Cliente";

export default function PanelAdmin() {
    const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10)); 
    const [horaLimite, setHoraLimite] = useState("09:15");

    const [cargandoAsignacion, setCargandoAsignacion] = useState(false);
    const [cargandoNoShow, setCargandoNoShow] = useState(false);

    const [resultadoAsignacion, setResultadoAsignacion] = useState(null);
    const [resultadoNoShow, setResultadoNoShow] = useState(null)

    async function ejecutarAsignacion() {
        setCargandoAsignacion(true);
        setResultadoAsignacion(null);
        try {
            const res = await api.post("/api/ejecutar-asignacion/", {
                fecha
            });
            setResultadoAsignacion(res.data);
        } catch (err) {
            console.log(err.response);
            setResultadoAsignacion(err.response?.data ?? { error: err.message });
        }
        setCargandoAsignacion(false);
    }
    async function ejecutarNoShow() {
        setCargandoNoShow(true);
        setResultadoNoShow(null);
        try {
            const res = await api.post("/api/ejecutar-no-show/", {
                fecha,
                horaLimite
            });
            setResultadoNoShow(res.data);
        }
        catch (err) {
            console.log(err.response);
            setResultadoNoShow(err.response?.data ?? { error: err.message });
        }
        setCargandoNoShow(false);
    }
    return (
        <div className="panel-admin-container">
            <h1>Panel de Administración</h1>
            <div className="form-group">
                <label>Fecha:</label>
                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Hora Límite para No-Show:</label>
                <input
                    type="time"
                    value={horaLimite}
                    onChange={(e) => setHoraLimite(e.target.value)}
                />
            </div>
            <div className="buttons">
                <button onClick={ejecutarAsignacion} disabled={cargandoAsignacion}>
                    Ejecutar Asignación
                </button>
                <button onClick={ejecutarNoShow} disabled={cargandoNoShow}>
                    Ejecutar No-Show
                </button>
            </div>
            {resultadoAsignacion && (
                <div className="resultado">
                    <h2>Resultado de Asignación:</h2>
                    {resultadoAsignacion.error ? (
                        <p style={{ color: "red" }}>{resultadoAsignacion.error}</p>
                    ) : (
                        <pre>{JSON.stringify(resultadoAsignacion, null, 2)}</pre>
                    )}
                </div>
            )}
            {resultadoNoShow && (
                <div className="resultado">
                    <h2>Resultado de No-Show:</h2>
                    {resultadoNoShow.error ? (
                        <p style={{ color: "red" }}>{resultadoNoShow.error}</p>
                    ) : (
                        <pre>{JSON.stringify(resultadoNoShow, null, 2)}</pre>
                    )}
                </div>
            )}
        </div>
    );
}