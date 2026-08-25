const router = require("express").Router();
const { auth, authorize } = require("../middlewares/auth.js");
const { requestLeave, getUserRequests, cancelRequest } = require("../controllers/leave.js")

router.route("/").get((req, res) => {
  res.json("Working");
});
router.route("/request").post(auth, authorize("employee"), requestLeave);
router.route("/my").get(auth, authorize("employee"), getUserRequests);
router.route("/:id/cancel").patch(auth, authorize("employee"), cancelRequest);



module.exports = router;
