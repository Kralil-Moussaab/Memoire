import { createContext, useContext, useState, useEffect } from "react";
import {
  login as apiLogin,
  loginDoctor as apiLoginDoctor,
  logout as apiLogout,
  register as apiRegister,
  registerDoctor as apiRegisterDoctor,
  updateUser as apiUpdateUser,
  updatePassword as apiUpdatePassword,
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
      if (response.data) {
        setUser(response.data);
        return true;
      }
      return false;
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
    localStorage.removeItem("userType");
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

  const loginDoctor = async (email, password) => {
    try {
      const result = await apiLoginDoctor(email, password);

      if (result.success) {
        persistAuth(result.data.token, result.data.user);
        navigate("/doctor/dashboard");
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

  const registerDoctor = async (doctorData) => {
    try {
      const result = await apiRegisterDoctor(doctorData);

      if (result.success) {
        persistAuth(result.data.token, result.data.user);
        navigate("/doctor/dashboard");
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
      const response = await apiUpdateUser(user.id, userData);
      if (response.success) {
        if (response.data.user) {
          setUser((prevUser) => ({
            ...prevUser,
            ...response.data.user,
          }));
        }
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Update failed",
      };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await apiUpdatePassword(user.id, passwordData);
      if (response.success) {
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Password update failed",
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
    loginDoctor,
    logout,
    register,
    registerDoctor,
    updateProfile,
    changePassword,
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
