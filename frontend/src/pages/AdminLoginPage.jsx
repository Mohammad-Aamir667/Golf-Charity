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
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Login</h1>
        </div>
        
        <form className="bg-white rounded-lg shadow-lg p-8 space-y-5" onSubmit={onSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Admin email"
            value={form.email}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button 
            disabled={loading} 
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            {loading ? "Please wait..." : "Login as Admin"}
          </button>
        </form>

        {error && <p className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center font-medium">{error}</p>}
        
        <p className="text-center mt-6 text-gray-600">
          Regular user? <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">Go to Login</Link>
        </p>
      </div>
    </main>
  );
};

export default AdminLoginPage;
