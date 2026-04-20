const Course = require("../models/Course");
const User = require("../models/User");
const Tag = require("../models/Tags");
const Section=require("../models/Section")
const SubSection=require("../models/SubSection")
const Category=require("../models/Category")
const {uploadImageToCloudinary} = require("../utils/imageUploader");


exports.createCourse = async (req, res) => {
  try {
    const userId = req.user.id

    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
    } = req.body
    const thumbnail = req.files.thumbnailImage

    const tag = JSON.parse(_tag)
    const instructions = JSON.parse(_instructions)

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !thumbnail ||
      !category ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      })
    }
    if (!status || status === undefined) {
      status = "Draft"
    }
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    })

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      })
    }

    const categoryDetails = await Category.findById(category)
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      })
    }

    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    )
    console.log(thumbnailImage)

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,
    })


    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )

    const categoryDetails2 = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    })
  }
}


exports.getAllCourses = async (req, res) => {
  const courses = await Course.find({})
    .populate({
      path: "instructor",
      select: "-password -additionalDetails",
    })
    .exec();

  return res.status(200).json(
    { success: true, data: courses }
  );
};

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body; 

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }


    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        select:"-password -additionalDetails"
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error fetching course details",
    });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" })
    }

    if (req.files && req.files.thumbnailImage) {
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    
    const fieldsToUpdate = [
      "courseName",
      "courseDescription",
      "whatYouWillLearn",
      "price",
      "category",
      "status"
    ]

    fieldsToUpdate.forEach((field) => {
      if (updates[field] !== undefined) {
        course[field] = updates[field]
      }
    })

    if (updates.tag) {
      course.tag = JSON.parse(updates.tag)
    }
    if (updates.instructions) {
      course.instructions = JSON.parse(updates.instructions)
    }

    await course.save()

    const updatedCourse = await Course.findById(courseId) 
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec()

    return res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error("EDIT COURSE ERROR:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id

    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    const students = course?.studentsEnrolled || []; 
    
    await User.updateMany(
      { _id: { $in: students } },
      { $pull: { courses: courseId } }
    )
    const courseSections = course.courseContent || []
    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId)
      if (section) {
        
        const subSections = section.subSection || []
        await SubSection.deleteMany({ _id: { $in: subSections } })
      }
      await Section.findByIdAndDelete(sectionId)
    }

    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course and all related content deleted successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}