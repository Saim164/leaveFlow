const Leave = require("../models/leave");
const User = require("../models/user");

const requestLeave = async (req, res) => {
    try {
        const user = req.user;
        const { leaveType, startDate, endDate, description } = req.body;

        if (!leaveType || !startDate || !endDate || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: "Invalid startDate or endDate" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (start < today) {
            return res.status(400).json({ message: "startDate cannot be in the past" });
        }

        if (end < start) {
            return res.status(400).json({ message: "endDate cannot be before startDate" });
        }

        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        const pendingLeaves = await Leave.find({ employee: user._id, status: "pending" });
        const pendingDays = pendingLeaves.reduce((sum, leave) => sum + leave.days, 0);
        const availableBalance = user.leaveBalance - pendingDays;

        if (days > availableBalance) {
            return res.status(400).json({
                message: `Insufficient leave balance. You have ${availableBalance} day(s) available after pending requests but requested ${days}`,
            });
        }

        const newRequest = new Leave({
            employee: user._id,
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
        const requests = await Leave.find({ employee: user._id })
            .populate("employee", "name email")
            .sort({ createdAt: -1 });

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

const getAllRequests = async (req, res) => {
    try {
        const requests = await Leave.find({ status: { $ne: "cancelled" } }).populate(
            "employee",
            "name email"
        ).sort({ createdAt: -1 });

        return res.status(200).json({ requests });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const approveRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await Leave.findById(id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ message: "Only pending requests can be approved" });
        }

        const employee = await User.findById(request.employee);

        if (request.days > employee.leaveBalance) {
            return res.status(400).json({
                message: `Insufficient leave balance. Employee has ${employee.leaveBalance} day(s) remaining but the request is for ${request.days}`,
            });
        }

        employee.leaveBalance -= request.days;
        await employee.save();

        request.status = "approved";
        request.reviewedAt = new Date();
        await request.save();

        return res.status(200).json({ message: "Request approved successfully" });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const rejectRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { reviewReason } = req.body;

        const request = await Leave.findById(id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ message: "Only pending requests can be rejected" });
        }

        request.status = "rejected";
        request.reviewReason = reviewReason;
        request.reviewedAt = new Date();
        await request.save();

        return res.status(200).json({ message: "Request rejected successfully" });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    requestLeave, getUserRequests, cancelRequest, getAllRequests, approveRequest, rejectRequest
};