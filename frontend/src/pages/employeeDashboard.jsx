import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { apiError } from "../utils/apiError";
import { formatDate } from "../utils/formatDate";
import "./Dashboard.css";

const FILTERS = ["pending", "approved", "rejected"];

function EmployeeDashboard() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const [filter, setFilter] = useState("pending");

  const loadRequests = useCallback(
    () => api.get("/leaves/my").then((res) => setRequests(res.data.requests)),
    [],
  );

  useEffect(() => {
    loadRequests()
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
    refreshUser();
  }, [loadRequests, refreshUser]);

  const pendingCount = requests.filter((req) => req.status === "pending").length;
  const visibleRequests = requests.filter((req) => req.status === filter);

  const handleCancel = async (id) => {
    setActionId(id);
    try {
      await api.patch(`/leaves/${id}/cancel`);
      await loadRequests();
      await refreshUser();
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
              Request time off and track your leave.
            </p>
          </div>
          <div className="dashboard__actions">
            <button
              className="btn-primary"
              onClick={() => navigate("/employee/request-leave")}
            >
              Request a leave
            </button>
          </div>
        </div>

        <div className="dashboard__stats">
          <div className="stat">
            <div className="stat__value">{user.leaveBalance}</div>
            <div className="stat__label">Leave balance (days)</div>
          </div>
          <div className="stat">
            <div className="stat__value">{pendingCount}</div>
            <div className="stat__label">Pending requests</div>
          </div>
        </div>

        {error && <p className="alert-error">{error}</p>}

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
                    {formatDate(req.startDate)} &rarr; {formatDate(req.endDate)}{" "}
                    &middot; {req.days} day{req.days > 1 ? "s" : ""}
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
                    <button
                      className="btn-outline btn-danger"
                      onClick={() => handleCancel(req._id)}
                      disabled={actionId === req._id}
                    >
                      Cancel
                    </button>
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

export default EmployeeDashboard;
