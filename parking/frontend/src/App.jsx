import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import AppLayout from "./components/NavBar";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    setToken(storedToken);
  }, []);

  
  useEffect(() => {
    async function fetchUser() {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null);
      }
    }

    fetchUser();
  }, [token]);

  return (
    <BrowserRouter>
      <AppLayout token={token} user={user} setToken={setToken} setUser={setUser} />
    </BrowserRouter>
  );
}