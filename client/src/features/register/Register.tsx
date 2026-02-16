import { type FormEvent, useState } from "react";
import "./Register.css";

type RegisterProps = {
  onNavigateToLogin: () => void;
};

function Register({ onNavigateToLogin }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setStatusMessage("Please complete all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setStatusMessage("Password and confirm password must match.");
      return;
    }

    setStatusMessage(`Account ready for ${email}.`);
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="register-title">
        <p className="eyebrow">Nebula Workspace</p>
        <h1 id="register-title">Create account</h1>
        <p className="subtitle">
          Start collaborating in real-time with your team.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

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
            autoComplete="new-password"
            placeholder="Create your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <label htmlFor="confirm-password">Confirm password</label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>

        {statusMessage ? (
          <p className="status-message" role="status">
            {statusMessage}
          </p>
        ) : null}

        <p className="signup-copy">
          Already have an account?{" "}
          <a
            href="/login"
            onClick={(event) => {
              event.preventDefault();
              onNavigateToLogin();
            }}
          >
            Sign in
          </a>
        </p>
      </section>
    </main>
  );
}

export default Register;
