import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

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

    if (params.page) {
      apiParams.page = params.page;
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
    return response.data;
  } catch (error) {
    console.error(`Error fetching doctor with id ${id}:`, error);
    throw error;
  }
};



export default api;