import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login({ role }) {
  
  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/users/register", { name, email, password, role });
      setIsRegistering(false);
      setName("");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isRegistering) {
    return (
      <>
        <h2>Login</h2>
        <form >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "submit"}
          </button>
        </form>
        <p>
          Dont have an accout?{" "}
          <button
            onClick={() => {
              setIsRegistering(true);
              setError("");
            }}
          >
            Sign up
          </button>
        </p>
      </>
    );
  }
  return (
    <>
      <h2>Register</h2>{" "}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "submit"}
        </button>
      </form>
      <p>
        Already have an account?{" "}
        <button
          onClick={() => {
            setIsRegistering(false);
            setError("");
          }}
        >
          Login
        </button>
      </p>{" "}
    </>
  );
}

export default Login;
