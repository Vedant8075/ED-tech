const User = require("../models/User");
const OTP = require("../models/OTP");
const OTPGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const { mailSender } = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/passwordUpdate");
require("dotenv").config();

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "user already registered",
      });
    }

    var newOTP = OTPGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: true,
    });

    let result = await OTP.findOne({ otp: newOTP });
    while (result) {
      newOTP = OTPGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: true,
      });
      result = await OTP.findOne({ otp: newOTP });
    }

    const otpPayload = { email,otp: newOTP };
    const otpBody = await OTP.create(otpPayload);


    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      password,
      email,
      otp,
      accountType,
      contactNumber,
      confirmPassword,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !password ||
      !email ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const recentOTP = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (recentOTP.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (recentOTP[0].otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      contactNumber,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User registration failed",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "all fields are required",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user is not registered ",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 100),
        httpOnly: true,
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      succcess: false,
      message: "login failure please try again",
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { email, otp, oldpassword, newpassword } = req.body;

    if (!email || !oldpassword || !newpassword) {
      return res.status().json({
        success: false,
        message: "please fill all the values",
      });
    }

    const user = await User.find({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (await bcrypt.compare(user.password != oldpassword)) {
      return res.status().json({
        success: false,
        message: "please enter correct password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`,
        ),
      );
      console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating password",
      error: error.message,
    });
  }
};
