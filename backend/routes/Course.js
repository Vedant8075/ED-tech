const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseDetails,
} = require("../controllers/Course");
const {
  showAllCategories,
  createCategory,
} = require("../controllers/Category");
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection");
const {
  createRating,
  getAverageRating,
  getAllRatingReview,
} = require("../controllers/RatingAndReviews");

const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middleware/auth");

router.post("/createCourse", auth, isInstructor, createCourse);
router.get("/getAllCourses", getAllCourses);
router.get("/getCourseDetails", getCourseDetails);

router.post("/createcategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);

router.post("/addSection", auth, isInstructor, createSection);
router.put("/updateSection", auth, isInstructor, updateSection);
router.delete("/deleteSection", auth, isInstructor, deleteSection);

router.post("/subsection", auth, isInstructor, createSubSection);
router.put("/subsection", auth, isInstructor, updateSubSection);
router.delete("/subsection", auth, isInstructor, deleteSubSection);

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingReview);

module.exports = router;
