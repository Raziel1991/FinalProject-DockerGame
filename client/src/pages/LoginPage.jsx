import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { loginUser } from "../graphql/authApi";
import { useAuth } from "../context/AuthContext";

const demoCredentials = {
  email: "demo@dockerops.com",
  password: "Demo123!"
};

function LoginPage() {
  const { setToken } = useAuth();
  const [email, setEmail] = useState(import.meta.env.DEV ? demoCredentials.email : "");
  const [password, setPassword] = useState(import.meta.env.DEV ? demoCredentials.password : "");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await loginUser({
        email: email.trim(),
        password
      });

      setToken(result.token);
      setSuccessMessage(`Login successful. Welcome, ${result.user.username}.`);
    } catch {
      setErrorMessage("Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageLayout
      title="Login"
      description="Login form with simple validation and a backend-ready GraphQL auth call."
    >
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <label htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            placeholder="captain@dockerheist.dev"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label htmlFor="password">
          Password
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        {errorMessage ? (
          <p className="form-message form-message-error" role="alert">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="form-message form-message-success">{successMessage}</p>
        ) : null}

        <p className="todo-note">
          {import.meta.env.DEV
            ? "Development mode only: demo credentials are prefilled for faster testing."
            : "Production mode: credentials are never prefilled."}
        </p>
      </form>
    </PageLayout>
  );
}

export default LoginPage;
