import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { registerUser } from "../graphql/authApi";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const { setToken } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await registerUser({
        username,
        email,
        password
      });

      setToken(result.token);
      setSuccessMessage(`Registration successful. Welcome, ${result.user.username}.`);
    } catch {
      setErrorMessage("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageLayout
      title="Register"
      description="Create a player account with simple validation and backend-ready registration."
    >
      <form className="panel form-panel" onSubmit={handleSubmit} noValidate>
        <label htmlFor="username">
          Username
          <input
            id="username"
            type="text"
            placeholder="dockerCadet"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>

        <label htmlFor="register-email">
          Email
          <input
            id="register-email"
            type="email"
            placeholder="dockerCadet@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label htmlFor="register-password">
          Password
          <input
            id="register-password"
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <label htmlFor="confirm-password">
          Confirm Password
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </label>

        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
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
          This form uses the real GraphQL register mutation and stores the token for
          protected pages.
        </p>
      </form>
    </PageLayout>
  );
}

export default RegisterPage;
