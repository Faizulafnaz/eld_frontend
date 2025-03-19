import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Nav } from "../components/Nav";
import { HiX } from "react-icons/hi";
import axios from "axios";
import AuthContext from '../context/AuthContext'
import { toast, ToastContainer } from "react-toastify";

const API_URL = "http://127.0.0.1:8000/api/eld-logs/";

const EldLogForm = () => {
  const navigate = useNavigate();
  const {token} = useContext(AuthContext)
  const [logEntries, setLogEntries] = useState([
    { startTime: "", endTime: "", status: "Off-Duty", remark: "" },
  ]);

  const [errors, setErrors] = useState({});

  const [logDetails, setLogDetails] = useState({
    driverName: "",
    driverId: "",
    date: "",
    truckNumber: "",
    trailerNumber: "",
    carrierName: "",
    shippingDocNumber: "",
    currentCycleUsed: "",
    odometerStart: "",
    odometerEnd: "",
    totalMiles: "",
    coDriverName: "",
    location: "",
    logRemarks: "",
  });

  const lastEntryRef = useRef(null);

  const handleChange = (index, field, value) => {
    const updatedEntries = [...logEntries];
    updatedEntries[index][field] = value;
    setLogEntries(updatedEntries);
  };

  const handleDetailsChange = (field, value) => {
    setLogDetails((prev) => ({ ...prev, [field]: value }));
  };

  const addEntry = () => {
    setLogEntries([...logEntries, { startTime: "", endTime: "", status: "Off-Duty", remark: "" }]);
  };

  const removeEntry = (index) => {
    if (logEntries.length > 1) {
      setLogEntries(logEntries.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    if (lastEntryRef.current) {
      lastEntryRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [logEntries]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    const payload = {
      driver_name:logDetails.driverName,
      driver_id: logDetails.driverId,
      date: logDetails.date,
      truck_number: logDetails.truckNumber,
      trailer_number: logDetails.trailerNumber,
      carrier_name: logDetails.carrierName,
      shipping_doc_number: logDetails.shippingDocNumber,
      current_cycle_used: logDetails.currentCycleUsed,
      co_driver_name: logDetails.coDriverName,
      location: logDetails.location,
      log_remarks: logDetails.logRemarks,
      entries: logEntries.map((entry) => ({
        start_time: entry.startTime,
        end_time: entry.endTime,
        status: entry.status,
        remark: entry.remark,
      })),}
    
      try {
        const response = await axios.post(API_URL, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.id) {
          navigate(`/eld-log-pdf/${response.data.id}`);
        }
  
      } catch (error) {
        console.log(error);
        if (error.response && error.response.data) {
          setErrors(error.response.data);
          console.log(error.response.data?.entries)
          if (Array.isArray(error.response.data?.entries)) {
            error.response.data.entries.forEach((errMsg) => {
              toast.error(errMsg, { position: "top-right" });
            });
          } else {
            toast.error(error.response.data?.entries || "Failed to submit log. Please try again.", {
              position: "top-right",
            });
          }
        } else {
          setErrors({ general: "Failed to submit log. Please try again later." });
          toast.error("Failed to submit log. Please try again later.", { position: "top-right" });
        }
      }    
  };

  return (
    <div className="overflow-y-hidden max-h-screen">
      <Nav />
      <ToastContainer></ToastContainer>
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl mx-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
        style={{ marginTop: "120px", maxHeight: "600px" }}>
        <h2 className="text-2xl font-bold text-center mb-6">ELD Log Entry</h2>

        {/* 🔹 Driver & Vehicle Details */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Driver Name</label>
            <input type="text" value={logDetails.driverName} onChange={(e) => handleDetailsChange("driverName", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Driver ID</label>
            <input type="text" value={logDetails.driverId} onChange={(e) => handleDetailsChange("driverId", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" value={logDetails.date} onChange={(e) => handleDetailsChange("date", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" required />  
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Shipping Document Number</label>
            <input type="text" value={logDetails.shippingDocNumber} onChange={(e) => handleDetailsChange("shippingDocNumber", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Current Cycle Used (Hours)</label>
            <input type="number" value={logDetails.currentCycleUsed} onChange={(e) => handleDetailsChange("currentCycleUsed", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Carrier Name</label>
            <input type="text" value={logDetails.carrierName} onChange={(e) => handleDetailsChange("carrierName", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Truck Number</label>
            <input type="text" value={logDetails.truckNumber} onChange={(e) => handleDetailsChange("truckNumber", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Trailer Number</label>
            <input type="text" value={logDetails.trailerNumber} onChange={(e) => handleDetailsChange("trailerNumber", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        {/* 🔹 Log Entries Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {logEntries.map((entry, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 items-center relative p-3 border rounded-lg bg-gray-50"
              ref={index === logEntries.length - 1 ? lastEntryRef : null}>
              
              {/* Remove Entry Button */}
              <HiX className="h-5 w-5 absolute top-2 right-2 cursor-pointer hover:text-gray-700"
                onClick={() => removeEntry(index)} />

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input type="time" value={entry.startTime} onChange={(e) => handleChange(index, "startTime", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input type="time" value={entry.endTime} onChange={(e) => handleChange(index, "endTime", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
              </div>

              {/* Duty Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Duty Status</label>
                <select value={entry.status} onChange={(e) => handleChange(index, "status", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="Off-Duty">Off-Duty</option>
                  <option value="Sleeper Berth">Sleeper Berth</option>
                  <option value="Driving">Driving</option>
                  <option value="On-Duty (Not Driving)">On-Duty (Not Driving)</option>
                </select>
              </div>

              {/* Remarks */}
              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700">Remarks</label>
                <input type="text" value={entry.remark} onChange={(e) => handleChange(index, "remark", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
          ))}

          {/* Buttons */}
          <button type="button" onClick={addEntry} className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-semibold">+ Add Entry</button>
          <button type="submit" onSubmit={(e) => handleSubmit(e) } className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold">Generate Log</button>
        </form>
      </div>
    </div>
  );
};

export default EldLogForm;
