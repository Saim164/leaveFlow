import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import ManagerLogin from "./pages/managerLogin";
import EmployeeLogin from "./pages/employeeLogin";
import ManagerDashboard from "./pages/managerDashboard";
import EmployeeDashboard from "./pages/employeeDashboard";
import RequestLeave from "./pages/requestLeave";

const NotFound = () => <h2>404 - Page Not Found</h2>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/manager/login" element={<ManagerLogin />} />
        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/request-leave" element={<RequestLeave />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
