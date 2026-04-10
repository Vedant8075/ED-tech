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

router.post("/course", auth, isInstructor, createCourse);
router.get("/courses", getAllCourses);
router.get("/course/:courseId", getCourseDetails);

router.post("/category", auth, isAdmin, createCategory);
router.get("/categories", showAllCategories);

router.post("/section", auth, isInstructor, createSection);
router.put("/section", auth, isInstructor, updateSection);
router.delete("/section", auth, isInstructor, deleteSection);

router.post("/subsection", auth, isInstructor, createSubSection);
router.put("/subsection", auth, isInstructor, updateSubSection);
router.delete("/subsection", auth, isInstructor, deleteSubSection);

router.post("/rating", auth, isStudent, createRating);
router.get("/rating/average", getAverageRating);
router.get("/reviews", getAllRatingReview);

module.exports = router;
