import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from '../context/AuthContext'
import { Nav } from "../components/Nav";

const API_URL =  `${import.meta.env.VITE_API_URL}/view-log`

const EldLogPDF = () => {
  const { logId } = useParams();
  const {token} = useContext(AuthContext)
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await axios.get(`${API_URL}/${logId}/`, { responseType: "blob", headers: {
            Authorization: `Bearer ${token}`,
          }, },  );
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        setPdfUrl(URL.createObjectURL(pdfBlob));
      } catch (error) {
        console.error("Error fetching PDF", error);
      }
    };
    fetchPDF();
  }, [logId]);

  return (
    <>
    <Nav></Nav>
    <div className="flex flex-col items-center justify-center min-h-screen mt-24">
      <h2 className="text-2xl font-bold mb-4">ELD Log PDF</h2>

      {pdfUrl ? (
        <>
          <iframe src={pdfUrl} className="w-full h-[80vh] border" title="ELD Log PDF"></iframe>
          <a href={pdfUrl} download={`eld_log_${logId}.pdf`} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
            Download PDF
          </a>
        </>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
    </>
  );
};

export default EldLogPDF;
