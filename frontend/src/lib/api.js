export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token"); // ✅ inside
  
  const response = await fetch(BASE_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // 🔥 REQUIRED
    },
  });

  const data = await response.json();
  return { response, data };
};