const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required properties",
      })
    }
    const newSection = await Section.create({ sectionName })

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()
    res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

exports.updateSection = async (req, res) => {
  try {
    const { sectionId, sectionName, courseId } = req.body; // Added courseId

    if (!sectionId || !sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "SectionId, SectionName, and CourseId are required",
      });
    }

    // 1. Update the section
    await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    // 2. Fetch the FULL course and populate it
    // This is the "Magic Step" that keeps the NestedView visible
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: updatedCourse, // Return the WHOLE course, not just the section
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error updating section",
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;

    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "SectionId and CourseId are required",
      });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course does not exist",
      });
    }

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }


    if (section.subSection && section.subSection.length > 0) {
      await SubSection.deleteMany({
        _id: { $in: section.subSection },
      });
    }

    await Section.findByIdAndDelete(sectionId);

    await Course.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    });

    const updatedCourse = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error deleting section",
    });
  }
};