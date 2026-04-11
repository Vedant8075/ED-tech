const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    if(!sectionName || !courseId)
    {
        return res.status(400).json({
            success:false,
            message:"missing properties"
        })
    }

      const checkCourse = await Course.findById(courseId);

    if(!checkCourse)
    {
      return res.json({
        success:false,
        message:"course does not exists"
      })
    }

    const section = await Section.create({ sectionName });

    const newCourse= await Course.findByIdAndUpdate(courseId, {
      $push: { courseContent: section._id },
    },{new:true});

    return res.json({
      success: true,
      message: "Section created",
      data: newCourse,
    });
  } catch (error) {
    res.status(500).json({ success: false,
        message:"unable to create section,please try again"
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { sectionId, sectionName } = req.body;

    if (!sectionId || !sectionName) {
      return res.status(400).json({
        success: false,
        message: "SectionId and SectionName are required",
      });
    }

    const existingSection = await Section.findById(sectionId);
    if (!existingSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
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