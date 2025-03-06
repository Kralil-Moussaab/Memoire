import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post("/v1/users/login", { email, password });
    const { token, user } = response.data;

    if (token && user) {
      return {
        success: true,
        data: { token, user },
      };
    }
    return { success: false, error: "Invalid response from server" };
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || "Login failed. Please try again.",
    };
  }
};

export const logout = async () => {
  try {
    await api.post("/v1/users/logout");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "Logout failed" };
  } finally {
    localStorage.removeItem("token");
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/v1/users", userData);
    const { token, user } = response.data;

    if (token && user) {
      return {
        success: true,
        data: { token, user },
      };
    }
    return { success: false, error: "Invalid response from server" };
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Registration failed. Please try again.",
    };
  }
};

export const updateUser = async (userData) => {
  return api.put("v1/users/", userData);
};

export const listDoctors = async (params = {}) => {
  try {
    const apiParams = {};

    if (params.name) {
      apiParams["name[eq]"] = params.name;
    }

    if (params.city) {
      apiParams["city[eq]"] = params.city;
    }

    if (params.speciality) {
      apiParams["speciality[eq]"] = params.speciality;
    }

    if (params.gender) {
      apiParams["gender[eq]"] = params.gender;
    }

    if (params.page) {
      apiParams.page = params.page;
    }

    const response = await api.get("/v1/doctors", { params: apiParams });
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export const getDoctorById = async (id) => {
  try {
    const response = await api.get(`/v1/doctors/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching doctor with id ${id}:`, error);
    throw error;
  }
};

export default api;
