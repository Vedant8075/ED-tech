const jwt = require("jsonwebtoken");
const User=require("../models/User")
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "TOKEN MISSING",
      });
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log(payload);
      req.user = payload;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "this route isonly for students",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "user role is not matching",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType != "Admin") {
      return res.status(401).json({
        success: false,
        message: "this route isonly for admins",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "user role is not matching",
    });
  }
};

exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType != "Instructor") {
      return res.status(401).json({
        success: false,
        message: "this route isonly for instructors",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "user role is not matching",
    });
  }
};
