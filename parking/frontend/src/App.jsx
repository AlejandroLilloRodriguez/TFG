import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import AppLayout from "./components/NavBar";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    setToken(storedToken);
  }, []);

  return (
    <BrowserRouter>
      <AppLayout token={token} setToken={setToken} />
    </BrowserRouter>
  );
}