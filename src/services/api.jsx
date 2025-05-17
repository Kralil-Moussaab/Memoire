import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
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
    const response = await api.post("/v1/users/login", { email, password });
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
    const response = await api.post("/v1/doctors/login", { email, password });
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

    const response = await api.post("/v1/doctors", formData);
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
    const response = await api.post("/v1/users", userData);
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
    await api.post(isDoctor ? "/v1/doctors/logout" : "/v1/users/logout");
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
      isDoctor ? "/v1/doctors/profile" : "/v1/users/profile"
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

    const endpoint = isDoctor ? `/v1/doctors/${userId}` : `/v1/users/${userId}`;
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
      ? `/v1/doctors/update/password/${userId}`
      : `/v1/users/update/password/${userId}`;

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

    const response = await api.get("/v1/doctors", { params: apiParams });
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export const getDoctorById = async (id) => {
  try {
    const response = await api.get(`/v1/doctors/${id}`);
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
    const response = await api.post("/v1/appointments", {
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
    const response = await api.get(`/v1/appointments/doctor/Scheduled/${id}`);
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
    const response = await api.patch(`/v1/appointments/scheduled/${id}`, {
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
    const response = await api.get(`/v1/appointments/scheduled/doctor`);
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
    const response = await api.get(`/v1/appointments/user/${id}`);
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
    const response = await api.patch("/v1/users/balance/chat", {
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
    const response = await api.patch(`/v1/users/update/balance`, data);
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
    const response = await api.get(`/v1/users/${id}`);
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
    const response = await api.get("/v1/chatMessage");
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
    const response = await api.post("/v1/chatMessage/send", {
      sessionId,
      message
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Send message error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to send message"
    };
  }
};

export const goOnline = async (id, data) => {
  try {
    const response = await api.patch(`/v1/doctors/${id}`, data);
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
    const response = await api.post("/v1/admin/login", { email, password });
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
    await api.post("/v1/admin/logout");
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
    const response = await api.get(`/v1/users`);
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
    const response = await api.get(`/v1/admin/stats`);
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
    const response = await api.get(`/v1/doctor/stats`);
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

    const response = await api.get("/v1/admin/doctors", { params: apiParams });
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export const approveDoctor = async (DoctorId) => {
  try {
    const response = await api.post("/v1/admin/approve", DoctorId);

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("approve doctor error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to approve doctor "
    };
  }
};

export default api;