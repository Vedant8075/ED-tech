const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  sendOtp,
  updatePassword,
} = require("../controllers/Auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

const { auth } = require("../middleware/auth");

router.post("/login", login);
router.post("/signup", signup);
router.post("/sendotp", sendOtp);
router.post("/changepassword", auth, updatePassword);
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

module.exports = router;
