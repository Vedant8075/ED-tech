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
  const { sectionId, sectionName } = req.body;

  const section = await Section.findByIdAndUpdate(
    sectionId,
    { sectionName },
    { new: true },
  );

  res.json({ success: true, data: section,message:"section updated successfully"});
};

exports.deleteSection = async (req, res) => {
  const { sectionId } = req.body;

  await Section.findByIdAndDelete(sectionId);

  res.json({ success: true, message: "Deleted" });
};
