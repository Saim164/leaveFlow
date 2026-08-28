import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/navbar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { apiError } from "../utils/apiError";
import { formatDate } from "../utils/formatDate";
import "./Dashboard.css";

const FILTERS = ["pending", "approved", "rejected"];

function ManagerDashboard() {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [rejectingId, setRejectingId] = useState(null);
  const [reviewReason, setReviewReason] = useState("");

  const loadRequests = useCallback(
    () => api.get("/leaves/all").then((res) => setRequests(res.data.requests)),
    [],
  );

  useEffect(() => {
    loadRequests()
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
  }, [loadRequests]);

  const pendingCount = requests.filter((req) => req.status === "pending").length;
  const visibleRequests = requests.filter((req) => req.status === filter);
  const rejectingRequest = requests.find((req) => req._id === rejectingId);

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await api.patch(`/leaves/${id}/approve`);
      await loadRequests();
    } catch (err) {
      setError(apiError(err));
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
    setActionId(rejectingId);
    try {
      await api.patch(`/leaves/${rejectingId}/reject`, { reviewReason });
      closeReject();
      await loadRequests();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setActionId(null);
    }
  };

  return (
    <>
      <Navbar />
      <main className="dashboard">
        <div className="dashboard__header">
          <div>
            <h1 className="dashboard__title">Welcome, {user.name}</h1>
            <p className="dashboard__subtitle">
              Review and manage your team's leave requests.
            </p>
          </div>
        </div>

        <div className="dashboard__stats">
          <div className="stat">
            <div className="stat__value">{pendingCount}</div>
            <div className="stat__label">Pending requests</div>
          </div>
        </div>

        {error && <p className="alert-error">{error}</p>}

        {rejectingId && (
          <div className="reject-form">
            <p className="reject-form__title">
              Reject {rejectingRequest?.employee?.name}'s{" "}
              {rejectingRequest?.leaveType} leave
            </p>
            <form onSubmit={handleReject}>
              <textarea
                className="reject-form__input"
                placeholder="Reason for rejection"
                value={reviewReason}
                onChange={(e) => setReviewReason(e.target.value)}
                required
              ></textarea>
              <div className="reject-form__actions">
                <button
                  className="btn-primary"
                  type="submit"
                  disabled={actionId === rejectingId}
                >
                  Confirm reject
                </button>
                <button
                  className="btn-outline"
                  type="button"
                  onClick={closeReject}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter${filter === f ? " filter--active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading && <p className="empty">Loading...</p>}

        {!loading && visibleRequests.length === 0 && (
          <p className="empty">No records</p>
        )}

        {!loading && visibleRequests.length > 0 && (
          <div className="requests">
            {visibleRequests.map((req) => (
              <div className="request" key={req._id}>
                <div className="request__main">
                  <span className="request__type">{req.leaveType} leave</span>
                  <span className="request__dates">
                    {req.employee?.name} &middot; {formatDate(req.startDate)}{" "}
                    &rarr; {formatDate(req.endDate)} &middot; {req.days} day
                    {req.days > 1 ? "s" : ""}
                  </span>
                  {req.status === "rejected" && req.reviewReason && (
                    <span className="request__reason">
                      Reason: {req.reviewReason}
                    </span>
                  )}
                </div>
                <div className="request__side">
                  <span className={`badge badge--${req.status}`}>
                    {req.status}
                  </span>
                  {req.status === "pending" && (
                    <>
                      <button
                        className="btn-outline"
                        onClick={() => handleApprove(req._id)}
                        disabled={actionId === req._id}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-outline btn-danger"
                        onClick={() => openReject(req._id)}
                        disabled={actionId === req._id}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default ManagerDashboard;
