import { useState } from "react";
import { api } from "../api/Cliente";

export default function Simulador() {
    const [matricula, setMatricula] = useState("");
    const [respuesta, setRespuesta] = useState(null);
    const [cargando, setCargando] = useState(false);
    async function entrada() {
        setCargando(true);
        setRespuesta(null);
        try{
            const res = await api.post("/api/lecturas/entrada/", {
                matricula: matricula,
            });
            setRespuesta(res.data);
        } catch (err) {
            console.log(err.response);
            setRespuesta(err.response?.data ?? { error: err.message });
        
        }
        setCargando(false);
    }
    async function salida() {
        setCargando(true);
        setRespuesta(null);
        try{
            const res = await api.post("/api/lecturas/salida/", {
                matricula: matricula,
            });
            setRespuesta(res.data);
        } catch (err) {
            console.log(err.response);
            setRespuesta(err.response?.data ?? { error: err.message });
        }
        setCargando(false);
    }
    return (
        <div className="simulador-container">
            <h1>Simulador de Entrada/Salida</h1>
            <input
                type="text"
                placeholder="Matrícula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
            />
            <div className="buttons">
                <button onClick={entrada} disabled={cargando}>Simular Entrada</button>
                <button onClick={salida} disabled={cargando}>Simular Salida</button>
            </div>
            {respuesta && (
                <div className="respuesta">
                    {respuesta.error ? (
                        <p style={{ color: "red" }}>{respuesta.error}</p>
                    ) : (
                        <div>
                            <p>Simulación exitosa:</p>
                            <pre>{JSON.stringify(respuesta, null, 2)}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}