import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function ManagerDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [reviewReason, setReviewReason] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/leaves/all");
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

  const handleApprove = async (id) => {
    setError("");
    try {
      await api.patch(`/leaves/${id}/approve`);
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const openReject = (id) => {
    setRejectingId(id);
    setReviewReason("");
    setError("");
  };

  const closeReject = () => {
    setRejectingId(null);
    setReviewReason("");
  };

  const handleReject = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.patch(`/leaves/${rejectingId}/reject`, { reviewReason });
      closeReject();
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
          Welcome {user.name.toUpperCase()} , plz handle the following requests
        </h1>
        <div>
          <h2>{pendingCount}</h2>
          <p>pending requests</p>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
        </div>

        {rejectingId && (
          <form onSubmit={handleReject}>
            <p>Reject request</p>
            <textarea
              placeholder="Reason for rejection"
              value={reviewReason}
              onChange={(e) => setReviewReason(e.target.value)}
              required
            ></textarea>
            <button type="submit">Confirm reject</button>
            <button type="button" onClick={closeReject}>
              Cancel
            </button>
          </form>
        )}

        <ul>
          {requests.map((req) => (
            <li key={req._id}>
              {req.employee?.name} — {req.leaveType} {req.days} day
              {req.days > 1 ? "s" : ""} — {req.status}
              {req.status === "pending" && (
                <>
                  <button onClick={() => handleApprove(req._id)}>Approve</button>
                  <button onClick={() => openReject(req._id)}>Reject</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default ManagerDashboard;
