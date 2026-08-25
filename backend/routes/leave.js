const router = require("express").Router();
const { auth, authorize } = require("../middlewares/auth.js");
const {
  requestLeave,
  getUserRequests,
  cancelRequest,
  getAllRequests,
  approveRequest,
  rejectRequest,
} = require("../controllers/leave.js");

router.route("/health").get((req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});
router.route("/request").post(auth, authorize("employee"), requestLeave);
router.route("/my").get(auth, authorize("employee"), getUserRequests);
router.route("/:id/cancel").patch(auth, authorize("employee"), cancelRequest);
router.route("/all").get(auth, authorize("manager"), getAllRequests);
router.route("/:id/approve").patch(auth, authorize("manager"), approveRequest);
router.route("/:id/reject").patch(auth, authorize("manager"), rejectRequest);

module.exports = router;
