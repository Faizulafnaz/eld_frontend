import {Routes, Route } from "react-router";
import Home  from './pages/Home';
import { Login } from './pages/Login';
import ProtectedLayout from './components/ProtectedLayout';
import RoutePreview from "./pages/RoutePreview";
import EldLogForm from "./pages/EldLogForm";
import EldLogPDF from "./pages/EldLogPdf";
import ViewLogs from "./pages/ViewLogs";
import SignUp from "./pages/SignUp";


function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<SignUp />}/>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/route-preview" element={<RoutePreview />} />
          <Route path="/eld-log" element={<EldLogForm />} />
          <Route path="/eld-log-pdf/:logId" element={<EldLogPDF />} />
          <Route path="/view-logs" element={<ViewLogs />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
