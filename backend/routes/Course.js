const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse
} = require("../controllers/Course");
const {
  showAllCategories,
  createCategory,
  categoryPageDetails
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
router.get("/getFullCourseDetails", getCourseDetails);

router.post("/createcategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.get("/getCategoryPageDetails",categoryPageDetails);

router.post("/addSection", auth, isInstructor, createSection);
router.put("/updateSection", auth, isInstructor, updateSection);
router.delete("/deleteSection", auth, isInstructor, deleteSection);
router.post("/editCourse", auth, isInstructor, editCourse);
router.get("/getInstructorCourses",auth,isInstructor,getInstructorCourses)
router.delete("/deleteCourse",auth,isInstructor,deleteCourse)

router.post("/addSubSection", auth, isInstructor, createSubSection);
router.put("/updateSubSection", auth, isInstructor, updateSubSection);
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection);

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingReview);

module.exports = router;
