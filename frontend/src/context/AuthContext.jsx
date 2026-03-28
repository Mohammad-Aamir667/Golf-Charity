import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import AppAuthContext from "./appAuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    const { response, data } = await apiFetch("/auth/profile");
    if (!response.ok) {
      setUser(null);
      return null;
    }
    setUser(data.user);
    return data.user;
  };

  useEffect(() => {
    const init = async () => {
      await refreshProfile();
      setIsLoading(false);
    };
    init();
  }, []);

  const login = async ({ email, password }) => {
    const { response, data } = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  
    console.log("LOGIN RESPONSE:", data); // debug
  
    if (!response.ok) throw new Error(data.message || "Login failed");
  
    // 🔥 THIS LINE IS MISSING IN YOUR CODE
    localStorage.setItem("token", data.token);
  
    const loggedInUser = await refreshProfile();
    return { ...data, user: loggedInUser };
  };

  const signup = async ({ name, email, password }) => {
    const { response, data } = await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) throw new Error(data.message || "Signup failed");
    localStorage.setItem("token", data.token);
    const signedUpUser = await refreshProfile();
    return { ...data, user: signedUpUser };
  };

  const logout = async () => {
    await apiFetch("/auth/logout", { method: "POST" });
    setUser(null);
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    signup,
    logout,
    refreshProfile,
  };

  return <AppAuthContext.Provider value={value}>{children}</AppAuthContext.Provider>;
};
