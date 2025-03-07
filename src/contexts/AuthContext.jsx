import { createContext, useContext, useState, useEffect } from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  updateUser as apiUpdateUser,
  getCurrentUser,
} from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    if (!token) return false;

    try {
      const response = await getCurrentUser();
      setUser(response.data);
      return true;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      if (error.response?.status === 401) {
        clearAuth();
      }
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await fetchCurrentUser();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Re-fetch user data when token changes
  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  const persistAuth = (userToken, userData) => {
    localStorage.setItem("token", userToken);
    setToken(userToken);
    setUser(userData);
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const login = async (email, password) => {
    try {
      const result = await apiLogin(email, password);

      if (result.success) {
        persistAuth(result.data.token, result.data.user);
        navigate("/");
        return { success: true };
      }

      return { success: false, error: result.error };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const result = await apiRegister(userData);

      if (result.success) {
        persistAuth(result.data.token, result.data.user);
        navigate("/");
        return { success: true };
      }

      return { success: false, error: result.error };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Registration failed",
      };
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await apiUpdateUser(userData);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Update failed",
      };
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      clearAuth();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      clearAuth();
      navigate("/login");
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    register,
    updateProfile,
    loading,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
