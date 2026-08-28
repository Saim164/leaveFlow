import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { apiError } from "../utils/apiError";
import "./RequestLeave.css";

function RequestLeave() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (startDate < today) {
      setError("Start date cannot be in the past");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before start date");
      return;
    }

    setLoading(true);
    try {
      await api.post("/leaves/request", {
        leaveType,
        startDate,
        endDate,
        description,
      });
      navigate("/employee/dashboard");
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="request-leave">
        <div className="request-leave__card">
          <h1 className="request-leave__title">Request a leave</h1>
          <p className="request-leave__balance">
            Leave balance: <strong>{user.leaveBalance} day(s)</strong>
          </p>

          <form className="request-leave__form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="field__label" htmlFor="leaveType">
                Leave type
              </label>
              <select
                id="leaveType"
                className="field__control"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select leave type
                </option>
                <option value="annual">Annual</option>
                <option value="sick">Sick</option>
                <option value="casual">Casual</option>
              </select>
            </div>

            <div className="field-row">
              <div className="field">
                <label className="field__label" htmlFor="startDate">
                  From
                </label>
                <input
                  id="startDate"
                  className="field__control"
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="endDate">
                  To
                </label>
                <input
                  id="endDate"
                  className="field__control"
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="description">
                Reason
              </label>
              <textarea
                id="description"
                className="field__control"
                placeholder="Briefly describe your reason"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {error && <p className="request-leave__error">{error}</p>}

            <div className="request-leave__actions">
              <button
                className="request-leave__submit"
                type="submit"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit request"}
              </button>
              <button
                className="request-leave__cancel"
                type="button"
                onClick={() => navigate("/employee/dashboard")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default RequestLeave;
