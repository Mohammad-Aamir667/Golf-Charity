import { useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function App() {
  const [mode, setMode] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint = mode === "register" ? "register" : "login";
      const payload =
        mode === "register"
          ? formData
          : { email: formData.email, password: formData.password };

      const response = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setIsAuthenticated(true);
      setMessage(data.message);
      setFormData({ name: "", email: "", password: "" });
      await fetchProfile();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      setProfile(data.user);
      setIsAuthenticated(true);
      setMessage(data.message);
    } catch (error) {
      setIsAuthenticated(false);
      setProfile(null);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      setMessage(data.message || "Logged out");
      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsAuthenticated(false);
      setProfile(null);
    }
  };

  return (
    <main className="container">
      <h1>MERN Starter Auth</h1>
      <p className="subtitle">
        Backend: Express MVC + MongoDB + JWT | Frontend: React Vite
      </p>

      <div className="toggle">
        <button
          className={mode === "login" ? "active" : ""}
          onClick={() => setMode("login")}
          type="button"
        >
          Login
        </button>
        <button
          className={mode === "register" ? "active" : ""}
          onClick={() => setMode("register")}
          type="button"
        >
          Register
        </button>
      </div>

      {!isAuthenticated ? (
        <form className="card" onSubmit={submitAuth}>
          {mode === "register" && (
            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button disabled={loading} type="submit">
            {loading ? "Please wait..." : mode === "register" ? "Register" : "Login"}
          </button>
        </form>
      ) : (
        <section className="card">
          <div className="row">
            <button disabled={loading} type="button" onClick={fetchProfile}>
              {loading ? "Loading..." : "Get Profile"}
            </button>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
          {profile && (
            <pre className="profile">
              {JSON.stringify(
                { id: profile._id, name: profile.name, email: profile.email },
                null,
                2
              )}
            </pre>
          )}
        </section>
      )}

      {message && <p className="message">{message}</p>}
    </main>
  );
}

export default App;
