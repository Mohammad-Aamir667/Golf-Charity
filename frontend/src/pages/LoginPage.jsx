import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(form);

      if (result.user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Login</h1>
        </div>
        
        <form className="bg-white rounded-lg shadow-lg p-8 space-y-5" onSubmit={onSubmit}>
          <input 
            name="email" 
            placeholder="Email" 
            onChange={onChange} 
            required 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            onChange={onChange} 
            required 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        {error && <p className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center font-medium">{error}</p>}
        
        <p className="text-center mt-6 text-gray-600">
          Don&apos;t have an account? <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">Signup</Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
