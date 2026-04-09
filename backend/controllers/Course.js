const Course = require("../models/Course");
const User = require("../models/User");
const Tag = require("../models/Tags");
const upload=require("../utils/imageUploader")


exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, price, tag , whatYouWillLearn } = req.body;

    const thumbnail=req.files.thumbnailImage

    if (!req.files || !req.files.thumbnailImage) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }
    if(!courseName ||  !courseDescription||  !price||  !tag||  !whatYouWillLearn)
    {
      return res.status(400).json({
        success:false,
        message:"all fields are required"
      })
    }

    // find id from payload
    const userId=req.user.id 
    const instructorDetails=await User.findById(userId)

    if(!instructorDetails)
    {
      return res.status(404).json({
        success:false,
        message:"instructor not found"
      })
    }
    
    const tagDetails=await Tag.findById(tag)

    if(!tagDetails){
      return res.status(404).json({
        success: false,
        message: "tag details not found",
      });
    }

    const thumbnailImage=await upload.uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)

    const newcourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      price,
      tag:tagDetails._id,
      whatYouWillLearn,
      thumbnail:thumbnailImage.secure_url
    });

    await User.findByIdAndUpdate({_id:instructorDetails._id},
       { $push: {Course:newcourse._id}}
    );

    await Tag.findByIdAndUpdate(tagDetails._id, {
       $push: { course: newcourse._id },
    });

    return res.status(200).json({
      success: true,
      message: "Course created",
      data: newcourse,
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};


exports.getAllCourses = async (req, res) => {
  const courses = await Course.find({})
    .populate("instructor")
    .exec();

  return res.status(200).json(
    { success: true, data: courses }
  );
};
