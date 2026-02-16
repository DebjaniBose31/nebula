import reactLogo from "../../assets/react.svg";
import "./Home.css";

type HomeProps = {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
};

function Home({ onNavigateToLogin, onNavigateToRegister }: HomeProps) {
  return (
    <main className="home-page">
      <section className="home-card" aria-labelledby="home-title">
        <div className="home-logos">
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img src="/vite.svg" className="home-logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="home-logo home-logo-react" alt="React logo" />
          </a>
        </div>

        <h1 id="home-title">Vite + React</h1>
        <p className="home-subtitle">Choose how you want to continue.</p>

        <div className="home-actions">
          <button type="button" className="home-btn home-btn-primary" onClick={onNavigateToLogin}>
            Sign in
          </button>
          <button
            type="button"
            className="home-btn home-btn-secondary"
            onClick={onNavigateToRegister}
          >
            Sign up
          </button>
        </div>
      </section>
    </main>
  );
}

export default Home;
