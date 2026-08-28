const router = require("express").Router();
const { register, login, me } = require("../controllers/user");
const { auth } = require("../middlewares/auth.js");

router.route("/health").get((req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(auth, me);

module.exports = router;
