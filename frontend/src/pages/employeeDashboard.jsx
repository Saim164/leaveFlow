import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function ManagerDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/leaves/my");
      setRequests(res.data.requests);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount with a loading flag
    fetchRequests();
  }, []);

  const pendingCount = requests.filter(
    (req) => req.status === "pending",
  ).length;

  const handleCancel = async (id) => {
    setError("");
    try {
      await api.patch(`/leaves/${id}/cancel`);
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <h1>
          Welcome {user.name.toUpperCase()} , you can see you drequests and
          apply for other if desired
        </h1>
        <button
          onClick={() => {
            navigate("/employee/request-leave");
          }}
        >
          Request a leave
        </button>
        <div>
          <h2>{pendingCount}</h2>
          <p>pending requests</p>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
        </div>

        <ul>
          {requests.map((req) => (
            <li key={req._id}>
              {req.employee?.name} — {req.leaveType} {req.days} day
              {req.days > 1 ? "s" : ""} — {req.status}
              {req.status === "pending" && (
                <button onClick={() => handleCancel(req._id)}>
                  Cancel request
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default ManagerDashboard;
