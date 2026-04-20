const Course = require("../models/Course");
const User = require("../models/User");
const Tag = require("../models/Tags");
const {uploadImageToCloudinary} = require("../utils/imageUploader");


exports.createCourse = async (req, res) => {
  try {
    let { courseName, courseDescription, price, tag , whatYouWillLearn,instructions } = req.body;

    const thumbnail=req.files.thumbnailImage

    if (!req.files || !req.files.thumbnailImage) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }
    if (
      !courseName ||
      !courseDescription ||
      !price ||
      !tag ||
      !whatYouWillLearn ||
      !instructions
    ) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    const userId=req.user.id 
    const instructorDetails=await User.findById(userId)
    tag = JSON.parse(req.body.tag);
    instructions = JSON.parse(req.body.instructions);

    if(!instructorDetails)
    {
      return res.status(404).json({
        success:false,
        message:"instructor not found"
      })
    }
    
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME,
    );

    const newcourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      price,
      instructions,
      tag,
      whatYouWillLearn,
      thumbnail:thumbnailImage.secure_url
    });

    await User.findByIdAndUpdate({_id:instructorDetails._id},
       { $push: {Course:newcourse._id}}
    );

    return res.status(200).json({
      success: true,
      message: "Course created",
      data: newcourse,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false,
      message:"course cannot be created atp",
    });
  }
};


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