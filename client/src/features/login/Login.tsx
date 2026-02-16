import { type FormEvent, useState } from "react";
import "./Login.css";

type LoginProps = {
  onNavigateToRegister: () => void;
};

function Login({ onNavigateToRegister }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setStatusMessage("Please fill in both email and password.");
      return;
    }

    setStatusMessage(`Welcome back, ${email}!`);
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <p className="eyebrow">Nebula Workspace</p>
        <h1 id="login-title">Sign in</h1>
        <p className="subtitle">
          Continue to your shared coding sessions and team projects.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <div className="form-row">
            <label className="remember-option" htmlFor="remember">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>

        {statusMessage ? (
          <p className="status-message" role="status">
            {statusMessage}
          </p>
        ) : null}

        <p className="signup-copy">
          New to Nebula?{" "}
          <a
            href="/register"
            onClick={(event) => {
              event.preventDefault();
              onNavigateToRegister();
            }}
          >
            Create account
          </a>
        </p>
      </section>
    </main>
  );
}

export default Login;
