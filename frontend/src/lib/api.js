export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  export const apiFetch = async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      // This is the fetch equivalent of withCredentials: true
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  
    const data = await response.json().catch(() => ({}));
    return { response, data };
  };