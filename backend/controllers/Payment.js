const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/courseEnrollmentEmail");
const mongoose = require("mongoose");

exports.capturePayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const uid = new mongoose.Types.objectId(userId);

    if (course.studentsEnrolled.includes(uid)) {
      return res.json({
        success: false,
        message: "user already exists",
      });
    }

    const amount = course.price * 100;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        courseId: courseId,
        userId,
      },
    };

    const paymentResponse = await instance.orders.create(options);

    return res.status(200).json({
      success: true,
      data: paymentResponse,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "order cannot be created" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courseId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    await Course.findByIdAndUpdate(courseId, {
      $push: { studentsEnrolled: userId },
    });

    await User.findByIdAndUpdate(userId, {
      $push: { courses: courseId },
    });

    await mailSender(
      user.email,
      "Course Enrollment",
      courseEnrollmentEmail(course.courseName, user.name),
    );

    return res.status(200).json({
      success: true,
      message: "Payment successful & enrolled",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
