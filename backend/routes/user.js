const router = require("express").Router();
const { register, login } = require("../controllers/user");

router.route("/").get((req, res) => {
  res.json("Working");
});

router.route("/register").post(register);
router.route("/login").post(login);

module.exports = router;
