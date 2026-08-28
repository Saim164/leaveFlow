import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login({ role }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const roleLabel = role === "manager" ? "Manager" : "Employee";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const { data } = await api.post("/users/login", { email, password });
      login(data.user, data.token);
      navigate(
        data.user.role === "manager"
          ? "/manager/dashboard"
          : "/employee/dashboard",
      );
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await api.post("/users/register", { name, email, password, role });
      setIsRegistering(false);
      setName("");
      setPassword("");
      setMessage("Account created successfully. You can now log in.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (registering) => {
    setIsRegistering(registering);
    setError("");
    setMessage("");
  };

  return (
    <main className="auth">
      <div className="auth__card">
        <h1 className="auth__title">
          {roleLabel} {isRegistering ? "sign up" : "login"}
        </h1>
        <p className="auth__subtitle">
          {isRegistering
            ? `Create a ${roleLabel.toLowerCase()} account to get started.`
            : `Sign in to your ${roleLabel.toLowerCase()} account.`}
        </p>

        {message && <p className="auth__message">{message}</p>}
        {error && <p className="auth__error">{error}</p>}

        <form
          className="auth__form"
          onSubmit={isRegistering ? handleRegister : handleLogin}
        >
          {isRegistering && (
            <input
              className="auth__input"
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            className="auth__input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="auth__input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="auth__submit" type="submit" disabled={loading}>
            {isRegistering
              ? loading
                ? "Creating account..."
                : "Create account"
              : loading
                ? "Signing in..."
                : "Sign in"}
          </button>
        </form>

        <p className="auth__toggle">
          {isRegistering
            ? "Already have an account? "
            : "Don't have an account? "}
          <button
            type="button"
            className="auth__link"
            onClick={() => switchMode(!isRegistering)}
          >
            {isRegistering ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </main>
  );
}

export default Login;
