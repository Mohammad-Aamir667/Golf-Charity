export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem("token"); // 🔥 get latest token

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // ✅ ADD THIS
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  return { response, data };
};