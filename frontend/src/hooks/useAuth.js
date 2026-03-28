import { useContext } from "react";
import AppAuthContext from "../context/appAuthContext";

const useAuth = () => {
  const context = useContext(AppAuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export default useAuth;
