const User = require("../models/User");
const OTP = require("../models/OTP");
const OTPGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (User.findOne({ email })) {
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

    const otpPayload = { email, newOTP };
    const otpBody = await OTP.create(otpPayload);

    return res.status(200).json({
      success: true,
      messgae: "OTP created succesfully",
      newOTP,
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

    // Check required fields
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

    const profileDetails =await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        contactNumber: null,
    })

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      contactNumber,
      additionalDetails:profileDetails._id,
      image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
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


