import { use } from "react";
import {api} from "../api/Cliente";
import { useEffect } from "react";
import { useState } from "react";


export default function Vehiculos() {
    const [vehiculos, setVehiculos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [matricula, setMatricula] = useState("");
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    useEffect(() => {
         async function cargarVehiculos(){
            setCargando(true);
            setError(null);
            try {
                const res = await api.get("/api/vehiculos/");
                setVehiculos(res.data);
            } catch (err) {
                console.log(err);
                setError("Error al cargar vehículos");
            }
        }
        cargarVehiculos();
    }, []);
        async function crearVehiculos(){
            setCargando(true);
            setError(null);
            try {
                await api.post("/api/vehiculos/", {
                    matricula: matricula,
                    marca: marca,
                    modelo: modelo,
                });
                setMatricula("");
                setMarca("");
                setModelo("");
                cargarVehiculos();
            } catch (err) {
                console.log(err);
                setError("Error al crear vehículo");
            }
        }
    
       
    return (
        <div className="vehiculos-container">
            <h1>Mis Vehículos</h1>
            {cargando && <p>Cargando...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!cargando && !error && vehiculos.length === 0 && <p>No tienes vehículos registrados.</p>}
                <div className="crear-vehiculo">
                    <h2>Registrar Nuevo Vehículo</h2>
                    <input
                        type="text"
                        placeholder="Matrícula"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Marca"
                        value={marca}
                        onChange={(e) => setMarca(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Modelo"
                        value={modelo}
                        onChange={(e) => setModelo(e.target.value)}
                    />
                    <button onClick={crearVehiculos} disabled={cargando}>Registrar Vehículo</button>
                </div>
            {!cargando && !error && vehiculos.length > 0 && (
                <ul>
                    {vehiculos.map((vehiculo) => (
                        <li key={vehiculo.id}>
                            <p><strong>Matrícula:</strong> {vehiculo.matricula}</p>
                            <p><strong>Marca:</strong> {vehiculo.marca}</p>
                            <p><strong>Modelo:</strong> {vehiculo.modelo}</p>
                        </li>
                    ))}
                </ul>   
            )}
        </div>
    );
}