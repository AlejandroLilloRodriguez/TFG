import { useEffect, useState } from "react";
import { api } from "../api/Cliente";

export default function Ping() {
  const [status, setStatus] = useState("Cargando...");
  const [data, setData] = useState(null);

  useEffect(() => {
    async function run() {
      try {
        // Cambia esta ruta por una que exista en tu backend sin auth,
        // o por /admin/ si quieres solo comprobar que responde.
        const res = await api.get("/"); 
        setStatus("OK");
        setData(res.data);
      } catch (e) {
        setStatus("ERROR");
        setData({
          message: e.message,
          detail: e.response?.data ?? null,
          status: e.response?.status ?? null,
        });
      }
    }
    run();
  }, []);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <h2>Ping backend</h2>
      <p><b>Estado:</b> {status}</p>
      <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 8 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
