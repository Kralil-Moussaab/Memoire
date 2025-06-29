import axios from "axios";

const api = axios.create({
  // baseURL: "http://192.168.1.106:8000/api/v1",
  baseURL: "http://localhost:8000/api/v1",

  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Handle FormData separately
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post("/users/login", { email, password });
    const { token, user } = response.data;

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userType", "user");
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

export const loginDoctor = async (email, password) => {
  try {
    const response = await api.post("/doctors/login", { email, password });
    const { token, doctor } = response.data;

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userType", "doctor");
      return {
        success: true,
        data: { token, user: { ...doctor, isDoctor: true } },
      };
    }
    return { success: false, error: "Invalid response from server" };
  } catch (error) {
    console.error("Doctor login error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || "Login failed. Please try again.",
    };
  }
};

export const registerDoctor = async (doctorData) => {
  try {
    const formData = new FormData();

    // Add all doctor data to FormData
    Object.keys(doctorData).forEach((key) => {
      if (key === "picture" && doctorData[key]) {
        formData.append("picture", doctorData[key]);
      } else if (doctorData[key] !== null && doctorData[key] !== undefined) {
        formData.append(key, doctorData[key].toString());
      }
    });

    const response = await api.post("/doctors", formData);
    const { token, doctor } = response.data;

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userType", "doctor");
      return {
        success: true,
        data: { token, user: { ...doctor, isDoctor: true } },
      };
    }
    return { success: false, error: "Invalid response from server" };
  } catch (error) {
    console.error(
      "Doctor registration error:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Registration failed. Please try again.",
    };
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    const { token, user } = response.data;

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userType", "user");
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

export const logout = async () => {
  try {
    const isDoctor = localStorage.getItem("userType") === "doctor";
    await api.post(isDoctor ? "/doctors/logout" : "/users/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    return { success: false, error: "Logout failed" };
  }
};

export const getCurrentUser = async () => {
  try {
    const isDoctor = localStorage.getItem("userType") === "doctor";
    const response = await api.post(
      isDoctor ? "/doctors/profile" : "/users/profile"
    );
    return isDoctor ? { ...response.data, isDoctor: true } : response.data;
    // return {
    //   data: isDoctor ? { ...response.data, isDoctor: true } : response.data,
    // };
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const isDoctor = localStorage.getItem("userType") === "doctor";
    const changedData = {};
    const currentUser = await getCurrentUser();

    Object.keys(userData).forEach((key) => {
      if (userData[key] !== currentUser.data[key]) {
        changedData[key] = userData[key];
      }
    });

    if (userData.phoneNumber) {
      changedData.phoneNumber = String(userData.phoneNumber).trim();
    } else if (currentUser.data.phone_number) {
      changedData.phoneNumber = String(currentUser.data.phoneNumber).trim();
    }

    if (Object.keys(changedData).length === 0) {
      return {
        success: false,
        error: "No changes detected",
      };
    }

    if (!changedData.password) {
      delete changedData.password;
    }

    const endpoint = isDoctor ? `/doctors/${userId}` : `/users/${userId}`;
    const response = await api.put(endpoint, changedData);

    if (response.data.update) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        error: "Incorrect password",
      };
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      const errorMessages = Object.entries(error.response.data.errors)
        .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
        .join("\n");
      return {
        success: false,
        error: errorMessages,
      };
    }

    return {
      success: false,
      error: error.response?.data?.message || "Update failed",
    };
  }
};

export const updatePassword = async (userId, passwordData) => {
  try {
    const isDoctor = localStorage.getItem("userType") === "doctor";
    const endpoint = isDoctor
      ? `/doctors/update/password/${userId}`
      : `/users/update/password/${userId}`;

    const response = await api.patch(endpoint, {
      old_password: passwordData.old_password,
      password: passwordData.password,
      password_confirmation: passwordData.password_confirmation,
    });

    if (response.data.update) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: "Current password is incorrect",
    };
  } catch (error) {
    if (error.response?.data?.errors) {
      const errorMessages = Object.entries(error.response.data.errors)
        .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
        .join("\n");
      return {
        success: false,
        error: errorMessages,
      };
    }

    return {
      success: false,
      error: error.response?.data?.message || "Password update failed",
    };
  }
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

    if (params.status) {
      apiParams["status[eq]"] = params.status;
    }

    const response = await api.get("/doctors", { params: apiParams });
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export const getDoctorById = async (id) => {
  try {
    const response = await api.get(`/doctors/${id}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error(`Error fetching doctor with id ${id}:`, error);
    throw error;
  }
};

export const addAppointmentSlots = async (doctorId, slots) => {
  try {
    const response = await api.post("/appointments", {
      doctorId: doctorId,
      date: slots.date,
      time: slots.timeSlots,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error adding appointment slots:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add appointment slots",
    };
  }
};

export const getAppointmentSlotsById = async (id) => {
  try {
    const response = await api.get(`/appointments/doctor/Scheduled/${id}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error(`Error fetching doctor with id ${id}:`, error);
    throw error;
  }
};

export const approveAppointment = async (id, userId) => {
  try {
    const response = await api.patch(`/appointments/scheduled/${id}`, {
      userId,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error approving appointment:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to approve appointment",
    };
  }
};

export const getApproveAppointment = async () => {
  try {
    const response = await api.get(`/appointments/scheduled/doctor`);
    if (response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: "No data received from server",
    };
  } catch (error) {
    console.error("Error in getApproveAppointment:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Failed to fetch approved appointments",
    };
  }
};

export const getAppointmentsByUser = async (id) => {
  try {
    const response = await api.get(`/appointments/user/${id}`);
    return {
      success: true,
      data: response.data.appointments,
    };
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch appointments",
    };
  }
};

export const discountJewels = async ({ amount, doctorID }) => {
  try {
    const response = await api.patch("/users/balance/chat", {
      amount,
      doctorID,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error discounting jewels:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to discount jewels",
    };
  }
};

export const bayingJewels = async (data) => {
  try {
    const response = await api.patch(`/users/update/balance`, data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error baying jewels:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to baying jewels",
    };
  }
};

export const getUsersById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error(`Error fetching users with id ${id}:`, error);
    throw error;
  }
};

export const getchatMessage = async () => {
  try {
    const response = await api.get("/chatMessage");
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error(`Error fetching message :`, error);
    throw error;
  }
};

export const sendMessage = async (sessionId, message) => {
  try {
    const response = await api.post("/chatMessage/send", {
      sessionId,
      message,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Send message error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to send message",
    };
  }
};

export const goOnline = async (id, data) => {
  try {
    const response = await api.patch(`/doctors/${id}`, data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error going online:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to go online",
    };
  }
};

export const loginAdmin = async (email, password) => {
  try {
    const response = await api.post("/admin/login", { email, password });
    const { token, user } = response.data;

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userType", "admin");

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

export const logoutAdmin = async () => {
  try {
    await api.post("/admin/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    return { success: false, error: "Logout failed" };
  }
};

export const getAllUsers = async (id) => {
  try {
    const response = await api.get(`/users`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error(`Error fetching users`, error);
    throw error;
  }
};

export const getAdminStats = async (id) => {
  try {
    const response = await api.get(`/admin/stats`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching stats`, error);
    throw error;
  }
};

export const getDoctorAdminStats = async (id) => {
  try {
    const response = await api.get(`/doctor/stats`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching stats`, error);
    throw error;
  }
};

export const listAdminDoctors = async (params = {}) => {
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

    if (params.status) {
      apiParams["status[eq]"] = params.status;
    }

    if (params.approved) {
      apiParams["approved[eq]"] = params.approved;
    }

    const response = await api.get("/admin/doctors", { params: apiParams });
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export const approveDoctor = async (DoctorId) => {
  try {
    const response = await api.post("/admin/approve", DoctorId);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("approve doctor error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to approve doctor ",
    };
  }
};

export const deletDoctor = async (id) => {
  try {
    const response = await api.delete(`/doctors/${id}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error(`Error deleting doctor with id ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete doctor",
    };
  }
};

export const deletUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete user",
    };
  }
};

export const reviewDoctor = async (id, rating, type) => {
  try {
    const response = await api.post(`/chatSession/review/${id}`, {
      rating,
      type,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error review doctor:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to review doctor",
    };
  }
};

export const endChat = async (id) => {
  try {
    const response = await api.post(`/chatSession/end/${id}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error end chat:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to end chat",
    };
  }
};

export const getDoctorSaved = async () => {
  try {
    const response = await api.get("chat/showDoctor");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching doctor saved:`, error);
    throw error;
  }
};

export const getDoctorChat = async (id) => {
  try {
    const response = await api.get(`/chat/showChat/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching doctor chat:`, error);
    throw error;
  }
};

export const getPatientOfDoctor = async () => {
  try {
    const response = await api.get("doctor/client");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching doctor clients:`, error);
    throw error;
  }
};

export const getStatsDoctor = async () => {
  try {
    const response = await api.get("doctor/myStats");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching doctor stats:`, error);
    throw error;
  }
};

export const getSpecialtyData = async () => {
  try {
    const response = await api.get("admin/circle");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching specialty data:`, error);
    throw error;
  }
};

export const getAgeData = async () => {
  try {
    const response = await api.get("admin/diagram");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error fetching age data:`, error);
    throw error;
  }
};

export const deletAppointment = async (id) => {
  try {
    const response = await api.delete(`/appointments/${id}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error(`Error deleting Appointment with id ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete Appointment",
    };
  }
};

export default api;
