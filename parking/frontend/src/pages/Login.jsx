import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/Cliente";
import "./Login.css";

export default function Login( { setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Cargando...");

    try {
      const res = await api.post("/api/token/", {
        username: email,
        password,
      });

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      const me = await api.get("/api/me/");
      console.log("ME:", me.data);

      setStatus(null);
      setToken(res.data.access);
      navigate("/");
    } catch (err) {
      console.log("ERROR login:", err);
      setStatus(err.response?.data?.detail ?? "Incorrecto");
    }
  }

  return (
    <form className="login-container" onSubmit={handleSubmit}>
      <h1>LOGIN</h1>

      <div className="input-group">
        <label htmlFor="email">USERNAME</label>
        <input
          type="text"
          id="email"
          placeholder="admin2"
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
