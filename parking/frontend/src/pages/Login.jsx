import { useState } from "react";
import { api } from "../api/Cliente";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Cargando...");

    try {
      const res = await api.post("/api/token/", {
        username: email, 
        password: password,
      });

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      setStatus("Correcto");

      const usuario_actual = await api.get("/api/me/");
      navigate("/");

    // 4) Redirigir por rol
    if (usuario_actual.data.rol === "ADMIN") {
      navigate("/admin/asignacion");
    } else {
      navigate("/empleado/reservas");
    }
  } catch (err) {
    setStatus("Incorrecto");
  }
    
  }

  return (
    <form className="login-container" onSubmit={handleSubmit}>
      <h1>LOGIN</h1>

      <div className="input-group">
        <label htmlFor="email">EMAIL</label>
        <input
          type="email"
          id="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="password">PASSWORD</label>
        <input
          type="password"
          id="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit">SIGN IN</button>

      {status && <p style={{ marginTop: 10 }}>{status}</p>}

      
      

      <div className="footer">
        Don't have an account? <a href="#">Sign up</a>
      </div>
    </form>
  );
}

