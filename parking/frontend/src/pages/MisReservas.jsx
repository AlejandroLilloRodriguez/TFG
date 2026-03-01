    import { useEffect } from "react";
    import { useState } from "react";
    import { api } from "../api/Cliente";

    export default function Reservas() {
        const [reservas, setReservas] = useState([]);
        const [cargando, setCargando] = useState(true);
        const [error, setError] = useState(null);
        useEffect(() => {
            async function cargarReservas() {
                setCargando(true);
                setError(null);
                try {
                    const res = await api.get("/api/reservas/", {
                    });
                    setReservas(res.data);
                } catch (err) {
                    console.log(err);
                    setError("Error al cargar reservas");
                }
                setCargando(false);
            }
            cargarReservas();
        }, []);
       async function cancelarReserva(id) {
            setCargando(true);
            setError(null);
            try {
                await api.post(`/api/reservas/${id}/cancelar/`);
                setReservas(reservas.filter((r) => r.id !== id));
            } catch (err) {
                console.log(err);
                setError("Error al cancelar reserva");
            }
            setCargando(false);
       }
        function puedeCancelar(estado) {
            return estado === "PENDIENTE" || estado === "ASIGNADA";
        }


        return (
            <div className="reservas-container">
                <h1>Mis Reservas</h1>
                {cargando && <p>Cargando...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {!cargando && !error && reservas.length === 0 && <p>No tienes reservas.</p>}
                {!cargando && !error && reservas.length > 0 && (
                    <ul>   
                        {reservas.map((reserva) => (
                            <li key={reserva.id}>
                                <p><strong>Plaza:</strong> {reserva.plaza}</p>
                                <p><strong>Hora de Entrada:</strong> {new Date(reserva.fechaInicio).toLocaleString()}</p>
                                <p><strong>Hora de Salida:</strong> {new Date(reserva.fechaFinal).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                )}
                {!cargando && !error && reservas.length > 0 && (
                    <ul>
                        {reservas.map((reserva) => (
                            <li key={reserva.id}>
                                <p><strong>Estado:</strong> {reserva.estado}</p>
                                {puedeCancelar(reserva.estado) && (
                                    <button onClick={() => cancelarReserva(reserva.id)}>Cancelar Reserva</button>
                                )}
                            </li>
                        ))} 
                    </ul>
                )}

            </div>
        );
    }