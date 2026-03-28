import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(form);
      if (!result.user) {
        throw new Error("Failed to fetch user");
      }
      if (result.user.role !== "admin") {
        throw new Error("Admin access required");
      }
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h1>Admin Login</h1>
      <form className="card" onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Admin email"
          value={form.email}
          onChange={onChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          required
        />
        <button disabled={loading} type="submit">
          {loading ? "Please wait..." : "Login as Admin"}
        </button>
      </form>
      {error && <p className="message">{error}</p>}
      <p className="subtitle">
        Regular user? <Link to="/login">Go to Login</Link>
      </p>
    </main>
  );
};

export default AdminLoginPage;
