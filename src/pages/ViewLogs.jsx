import React, { useEffect, useState, useContext } from "react";
import { Nav } from "../components/Nav";
import CardComp from "../components/CardComp";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import Loading from "../components/Loading";


const API_URL = `${import.meta.env.VITE_API_URL}/eld-logs/`

const ViewLogs = () => {
  const { token } = useContext(AuthContext); // Get token from context
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Logs from API
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure authentication
          },
        });
        setLogs(response.data); // Store logs in state
      } catch (err) {
        console.error("Error fetching logs:", err);
        setError("Failed to fetch logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <div className="container mx-auto px-4">
        <h1 className="mt-24 text-2xl font-bold text-center text-gray-800 p-5">
          Your Past Logs
        </h1>

        {loading ? (
          <Loading></Loading>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : logs.length === 0 ? (
          <p className="text-center mt-10 text-gray-500">No logs found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-6 px-2">
            {logs.map((log) => (
              <CardComp key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewLogs;
