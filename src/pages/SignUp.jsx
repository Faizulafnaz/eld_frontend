import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/truck-red-converted-bdbe7b1994e04d9723fe6301a0608409f3f3a40cc45c821455354c3ec2cf4425.webp";
import Loading from "../components/Loading";

const API_URL =  `${import.meta.env.VITE_API_URL}/register/`

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Form Validation
  const validateForm = () => {
    let newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.rePassword) {
      newErrors.rePassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true)

    try {
      const response = await axios.post(API_URL, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Account created successfully! Redirecting...", {
        position: "top-right",
      });
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2s
    } catch (error) {
      if (error.response && error.response.data) {
        const apiErrors = error.response.data;
        Object.values(apiErrors).forEach((msg) => toast.error(msg[0], { position: "top-right" }));
      } else {
        toast.error("Failed to register. Try again later.", { position: "top-right" });
      }
    }
  };

  if (loading) return <Loading></Loading>

  return (
    <>
      <ToastContainer></ToastContainer>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img alt="Your Company" src={logo} className="mx-auto h-10 w-auto" />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Create a new account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900  placeholder-gray-400 focus:outline-indigo-600"
                required
              />
              {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900  placeholder-gray-400 focus:outline-indigo-600"
                required
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900  placeholder-gray-400 focus:outline-indigo-600"
                required
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="rePassword" className="block text-sm font-medium text-gray-900">
                Re-Enter Password
              </label>
              <input
                id="rePassword"
                name="rePassword"
                type="password"
                value={formData.rePassword}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900  placeholder-gray-400 focus:outline-indigo-600"
                required
              />
              {errors.rePassword && <p className="text-red-500 text-xs">{errors.rePassword}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-white font-semibold hover:bg-indigo-500"
              >
                Sign up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
