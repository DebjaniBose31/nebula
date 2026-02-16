import { type FormEvent, useState } from "react";
import "./Signup.scss";

type SignupProps = {
  onNavigateToLogin: () => void;
};

function Signup({ onNavigateToLogin }: SignupProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      setStatusMessage("Please complete all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setStatusMessage("Passwords do not match.");
      return;
    }

    setStatusMessage(`Account created for ${email}.`);
  };

  return (
    <main className="signup-page">
      <section className="signup-card" aria-labelledby="signup-title">
        <p className="eyebrow">Nebula Workspace</p>
        <h1 id="signup-title">Create account</h1>
        <p className="subtitle">Start collaborating with your team in real time.</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="full-name">Full name</label>
          <input
            id="full-name"
            name="full-name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />

          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            name="signup-email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            name="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <label htmlFor="confirm-password">Confirm password</label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          <button type="submit" className="submit-btn">
            Sign up
          </button>
        </form>

        {statusMessage ? (
          <p className="status-message" role="status">
            {statusMessage}
          </p>
        ) : null}

        <p className="login-copy">
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

export default Signup;
