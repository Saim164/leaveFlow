const router = require("express").Router();
const { register, login } = require("../controllers/user");

router.route("/health").get((req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});
router.route("/register").post(register);
router.route("/login").post(login);

module.exports = router;
