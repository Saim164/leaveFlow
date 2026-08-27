import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import api from "../api/axios";

function RequestLeave() {
  const navigate = useNavigate();

  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <h1>Request a Leave</h1>
      <form onSubmit={handleSubmit}>
        <select
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
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <textarea
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>{" "}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
        {error && <p>{error}</p>}
      </form>
    </>
  );
}

export default RequestLeave;
