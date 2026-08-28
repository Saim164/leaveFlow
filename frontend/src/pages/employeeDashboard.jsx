import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
  const { user, refreshUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

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
    refreshUser();
  }, [refreshUser]);

  const pendingCount = requests.filter(
    (req) => req.status === "pending",
  ).length;

  const handleCancel = async (id) => {
    setError("");
    setActionId(id);
    try {
      await api.patch(`/leaves/${id}/cancel`);
      await fetchRequests();
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setActionId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <h1>Welcome {user.name.toUpperCase()}</h1>
        <p>Leave balance: {user.leaveBalance} day(s)</p>
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

        {!loading && requests.length === 0 && <p>No requests yet</p>}

        <ul>
          {requests.map((req) => (
            <li key={req._id}>
              {req.leaveType} — {req.days} day{req.days > 1 ? "s" : ""} —{" "}
              {req.status}
              {req.status === "rejected" && req.reviewReason && (
                <span> — reason: {req.reviewReason}</span>
              )}
              {req.status === "pending" && (
                <button
                  onClick={() => handleCancel(req._id)}
                  disabled={actionId === req._id}
                >
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

export default EmployeeDashboard;
