const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const {uploadImageToCloudinary}=require("../utils/imageUploader")
exports.createSubSection = async (req, res) => {
  try {
    const { title, description, timeDuration , sectionId } = req.body;

    const video=req.files.videoFile

    if (!title || !description || !timeDuration || !sectionId ||!video) {
      return res.status(400).json({
        success: false,
        message: "missing properties",
      });
    }

    const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME)

    const subSection = await SubSection.create({
      title,
      description,
      timeDuration,
      videoUrl:uploadDetails.secure_url
    });

    await Section.findByIdAndUpdate({_id:sectionId}, {
      $push: { subSection: subSection._id },
    },{new:true});

    return res.json({
      success: true,
      message: "Lecture added",
      data: subSection,
    });
  } catch (error) {
    res.status(500).json({ success: false,
        message:"subsection cannot be created"
     });
  }
};

exports.updateSubSection = async (req, res) => {
  const { subSectionId, title } = req.body;

  const updated = await SubSection.findByIdAndUpdate(
    subSectionId,
    { title },
    { new: true },
  );

  res.json({ success: true, data: updated });
};

exports.deleteSubSection = async (req, res) => {
  const { subSectionId } = req.body;

  await SubSection.findByIdAndDelete(subSectionId);

  res.json({ success: true });
};
