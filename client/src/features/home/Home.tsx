import "./Home.scss";

type HomeProps = {
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
};

function Home({ onNavigateToLogin, onNavigateToSignup }: HomeProps) {
  return (
    <main className="home-page">
      <section className="home-card" aria-labelledby="home-title">
        <p className="home-eyebrow">Nebula Workspace</p>
        <h1 id="home-title">Get Started</h1>
        <p className="home-subtitle">Choose where you want to go.</p>

        <div className="home-actions">
          <button type="button" className="home-btn home-btn-primary" onClick={onNavigateToLogin}>
            Sign in
          </button>
          <button
            type="button"
            className="home-btn home-btn-secondary"
            onClick={onNavigateToSignup}
          >
            Sign up
          </button>
        </div>
      </section>
    </main>
  );
}

export default Home;
