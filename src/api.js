import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getELDLogs = async () => {
  const response = await axios.get(`${API_BASE_URL}/eld-logs/`);
  return response.data;
};

export const saveELDLog = async (logData) => {
  const response = await axios.post(`${API_BASE_URL}/eld-logs/`, logData);
  return response.data;
};
