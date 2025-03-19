import { createContext, useState, useEffect } from "react";
import axios from "axios";
import {API_BASE_URL} from "../api"
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("access") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      axios
        .get(`${API_BASE_URL}/user/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("access");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (e) => {
    e.preventDefault(); 
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/login/`, {
        username: e.target.username.value,
        password: e.target.password.value,
      });
  
      // Save user data in local storage
      localStorage.setItem("access", response.data.access);
      setToken(response.data.access);
      setUser(response.data.user);
      setLoading(false)
  
      navigate("/");
    } catch (error) {
      setLoading(false)
      if (error.response) {
        if (error.response.status === 400) {
          toast.error("Invalid username or password. Please try again.", { position: "top-right" });
        } else if (error.response.status === 401) {
          toast.error("Unauthorized access. Check your credentials.", { position: "top-right" });
        } else if (error.response.status === 500) {
          toast.error("Unauthorized access. Check your credentials.", { position: "top-right" });
        } else {
          toast.error(`Unexpected error: ${error.response.status}`, { position: "top-right" });
        }
      } else if (error.request) {
        toast.error("Network error. Please check your internet connection.",  { position: "top-right" });
      } else {
        toast.error("An unknown error occurred. Please try again.",  { position: "top-right" });
      }
      
    }
  };
  

  const logout = () => {
    localStorage.removeItem("access");
    setToken(null);
    setUser(null);
  };

  

  return (
    <AuthContext.Provider value={{ user, login, logout, token, loading}}>
      {children}   
    </AuthContext.Provider>
  );
};

export default AuthContext;
