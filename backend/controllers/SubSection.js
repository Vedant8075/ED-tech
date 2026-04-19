const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const {uploadImageToCloudinary}=require("../utils/imageUploader")
require("dotenv").config()

exports.createSubSection = async (req, res) => {
  try {
    const { title, description, timeDuration, sectionId, courseId } = req.body;
    const video = req.files.videoFile;
    if (!title || !description || !timeDuration || !sectionId || !video) {
      return res.status(400).json({
        success: false,
        message: "Missing properties",
      });
    }

    const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);


    const subSection = await SubSection.create({
      title,
      description,
      timeDuration,
      videoUrl: uploadDetails.secure_url,
    });


    const updatedCourse = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: subSection._id } }, 
      { new: true }
    ).populate("subSection");

    return res.json({
      success: true,
      message: "Lecture added successfully",
      data: updatedCourse, 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Subsection cannot be created",
      error: error.message 
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body
    const subSection = await SubSection.findById(subSectionId)

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    console.log("updated section", updatedSection)

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
  }
}

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "subSectionId and sectionId are required",
      });
    }

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

  
    await SubSection.findByIdAndDelete(subSectionId);

    await Section.findByIdAndUpdate(sectionId, {
      $pull: { subSection: subSectionId },
    });

    const updatedSection =
      await Section.findById(sectionId).populate("subSection");

    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error deleting subsection",
    });
  }
};

