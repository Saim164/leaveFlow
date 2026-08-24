const router = require("express").Router();
const { auth, authorize } = require("../middlewares/auth.js");

router.route("/").get(auth, authorize("manager"), (req, res) => {
  res.json("Working");
});

module.exports = router;
