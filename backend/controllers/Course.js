const Course = require("../models/Course");
const User = require("../models/User");
const Tag = require("../models/Tags");


exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, price, tag , whatYouWillLearn } = req.body;
    const thumbnail=req.files.thumbnailImage

    const course = await Course.create({
      courseName,
      courseDescription,
      instructor: userId,
      price,
      category,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { courses: course._id },
    });

    return res.status(200).json({
      success: true,
      message: "Course created",
      data: course,
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

// students + public
exports.getAllCourses = async (req, res) => {
  const courses = await Course.find({})
    .populate("instructor")
    .populate("category");

  res.json({ success: true, data: courses });
};
