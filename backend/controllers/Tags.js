const Tag = require("../models/Tags");

exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "all fields required",
      });
    }

    const tag = await Tag.create({ name: name, description: description });

    return res.status(200).json({
      success: true,
      message: "Category created",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find({},{name:true,description:true});
    res.json({ success: true, allTags });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};
