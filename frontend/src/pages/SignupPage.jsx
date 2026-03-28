import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const result = await signup(form);
      navigate(result.user?.role === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Signup</h1>
        </div>
        
        <form className="bg-white rounded-lg shadow-lg p-8 space-y-5" onSubmit={onSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <button 
            disabled={loading} 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            {loading ? "Please wait..." : "Create account"}
          </button>
        </form>
        
        {error && <p className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center font-medium">{error}</p>}
        
        <p className="text-center mt-6 text-gray-600">
          Already have an account? <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">Go to Login</Link>
        </p>
      </div>
    </main>
  );
};

export default SignupPage;
