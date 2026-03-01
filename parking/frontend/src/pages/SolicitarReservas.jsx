import { useState } from "react";
import { api } from "../api/Cliente";

export default function SolicitarReservas() {
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [respuesta, setRespuesta] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [vehiculo, setVehiculo] = useState("");
    async function solicitarReserva() {
    setCargando(true);
    setRespuesta(null);

    if (!fechaInicio || !fechaFinal || !vehiculo) {
        setRespuesta({ error: "Todos los campos son obligatorios" });
        setCargando(false);
        return;
    }

    if (new Date(fechaFinal) <= new Date(fechaInicio)) {
        setRespuesta({ error: "La fecha final debe ser posterior a la fecha inicial" });
        setCargando(false);
        return;
    }

    try {
        const res = await api.post("/api/reservas/", {
            fechaInicio: new Date(fechaInicio).toISOString(),
            fechaFinal: new Date(fechaFinal).toISOString(),
            vehiculo: Number(vehiculo),
        });

        setRespuesta({ ok: "Reserva creada correctamente", data: res.data });

    } catch (err) {
        console.log(err.response);
        setRespuesta(err.response?.data ?? { error: err.message });
    }

    setCargando(false);
}
    return (
        <div className="solicitar-reserva-container">
            <h1>Solicitar Reserva</h1>
            <label>
                Fecha de Inicio:
                <input
                    type="datetime-local"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                />
            </label>
            <label>
                Fecha de Finalización:
                <input
                    type="datetime-local"
                    value={fechaFinal}
                    onChange={(e) => setFechaFinal(e.target.value)}
                />
            </label>
            <label>
                Vehículo:
                <input
                    type="text"
                    placeholder="ID del vehículo"
                    value={vehiculo}
                    onChange={(e) => setVehiculo(e.target.value)}
                />
            </label>
            <button onClick={solicitarReserva} disabled={cargando}>Solicitar Reserva</button>
            {respuesta && (
                <div className="respuesta">
                    {respuesta.error ? (
                        <p style={{ color: "red" }}>{respuesta.error}</p>
                    ) : (
                        <div>
                            <p>Reserva solicitada con éxito:</p>
                            <pre>{JSON.stringify(respuesta, null, 2)}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}