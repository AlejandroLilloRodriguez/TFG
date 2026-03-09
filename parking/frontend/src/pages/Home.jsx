import "./css/Home.css";
import parkingImage from "../assets/parking-hero.png";

export default function Home() {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  return (
    <section className="home">
      <div className="home-hero">
        <div className="home-hero-content">
          <span className="home-badge">Sistema inteligente de parking</span>

          <h1 className="home-title">
            Gestiona tu estacionamiento de forma simple, moderna y eficiente
          </h1>

          <p className="home-description">
            Centraliza reservas, vehículos y solicitudes en una única
            plataforma. Automatiza la operativa diaria de tu parking con una
            interfaz visual, rápida y profesional.
          </p>

        

        </div>

        <div className="home-hero-visual">
          <img src={parkingImage} alt="Parking moderno" className="hero-image" />
        </div>
      </div>

      <div className="home-grid">
        <article className="home-card">
          <span className="home-card-label">Reservas</span>
          <h3>Control total de ocupación</h3>
          <p>
            Consulta y administra reservas activas de forma centralizada y sin
            complicaciones.
          </p>
        </article>

        <article className="home-card">
          <span className="home-card-label">Vehículos</span>
          <h3>Gestión rápida de vehículos</h3>
          <p>
            Organiza los vehículos vinculados a cada usuario desde un panel más
            visual y ordenado.
          </p>
        </article>

        <article className="home-card">
          <span className="home-card-label">Simulación</span>
          <h3>Planificación inteligente</h3>
          <p>
            Simula escenarios y mejora la distribución del espacio del parking.
          </p>
        </article>
         <div className="home-actions">
            <button className="home-primary-button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
      </div>
    </section>
  );
}