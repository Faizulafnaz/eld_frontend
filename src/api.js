import axios from "axios";

export const API_BASE_URL = "http://127.0.0.1:8000/api";

export const getELDLogs = async () => {
  const response = await axios.get(`${API_BASE_URL}/eld-logs/`);
  return response.data;
};

export const saveELDLog = async (logData) => {
  const response = await axios.post(`${API_BASE_URL}/eld-logs/`, logData);
  return response.data;
};
