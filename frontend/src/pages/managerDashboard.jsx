import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function ManagerDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
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

  const rejectingRequest = requests.find((req) => req._id === rejectingId);

  const handleApprove = async (id) => {
    setError("");
    setActionId(id);
    try {
      await api.patch(`/leaves/${id}/approve`);
      await fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setActionId(null);
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
    setActionId(rejectingId);
    try {
      await api.patch(`/leaves/${rejectingId}/reject`, { reviewReason });
      closeReject();
      await fetchRequests();
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
        <h1>
          Welcome {user.name.toUpperCase()} , please handle the following
          requests
        </h1>
        <div>
          <h2>{pendingCount}</h2>
          <p>pending requests</p>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
        </div>

        {rejectingId && (
          <form onSubmit={handleReject}>
            <p>
              Reject {rejectingRequest?.employee?.name}'s{" "}
              {rejectingRequest?.leaveType} leave ({rejectingRequest?.days} day
              {rejectingRequest?.days > 1 ? "s" : ""})
            </p>
            <textarea
              placeholder="Reason for rejection"
              value={reviewReason}
              onChange={(e) => setReviewReason(e.target.value)}
              required
            ></textarea>
            <button type="submit" disabled={actionId === rejectingId}>
              Confirm reject
            </button>
            <button type="button" onClick={closeReject}>
              Cancel
            </button>
          </form>
        )}

        {!loading && requests.length === 0 && <p>No requests yet</p>}

        <ul>
          {requests.map((req) => (
            <li key={req._id}>
              {req.employee?.name} — {req.leaveType} {req.days} day
              {req.days > 1 ? "s" : ""} — {req.status}
              {req.status === "pending" && (
                <>
                  <button
                    onClick={() => handleApprove(req._id)}
                    disabled={actionId === req._id}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => openReject(req._id)}
                    disabled={actionId === req._id}
                  >
                    Reject
                  </button>
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
