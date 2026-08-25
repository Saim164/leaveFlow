const Leave = require("../models/leave");

const requestLeave = async (req, res) => {
    try {
        const user = req.user;
        const { leaveType, startDate, endDate, description } = req.body;

        const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

        const newRequest = new Leave({
            employee: user,
            leaveType,
            startDate,
            endDate,
            days,
            description,
        });

        await newRequest.save();

        return res.status(201).json({ message: "Request submitted successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getUserRequests = async (req, res) => {
    try {
        const user = req.user;
        const requests = await Leave.find({ employee: user._id }).populate(
            "employee",
            "name email"
        );

        return res.status(200).json({ requests });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const cancelRequest = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const request = await Leave.findById(id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.employee.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ message: "Only pending requests can be cancelled" });
        }

        request.status = "cancelled";
        await request.save();

        return res.status(200).json({ message: "Request cancelled successfully" });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = { requestLeave, getUserRequests, cancelRequest };