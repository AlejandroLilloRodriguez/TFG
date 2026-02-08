export default function Home() {
    function logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
    }
    return (
        <div className="home-container">
            <h1>Bienvenido a la aplicación de gestión de estacionamiento</h1>
            <p>Has iniciado sesión correctamente.</p>
            <button onClick={logout}>Cerrar Sesión</button>
            
        </div>
    );
}
