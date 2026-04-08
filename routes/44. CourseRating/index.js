const express = require("express")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const STUDENT_GET_ALL_COURSE_RATING = require("../../controllers/44. CourseRating/1. STUDENT_GET_ALL")
const STUDENT_POST_COURSE_RATING = require("../../controllers/44. CourseRating/3. STUDENT_POST")
const STUDENT_GET_SINGLE_COURSE_RATING = require("../../controllers/44. CourseRating/2. STUDENT_GET_SINGLE")
const STUDENT_UPDATE_COURSE_RATING = require("../../controllers/44. CourseRating/4. STUDENT_UPDATE")
const STUDENT_DELETE_COURSE_RATING = require("../../controllers/44. CourseRating/5. STUDENT_DELETE")

const router = express.Router()

router.route("/student-course-rating")
.get(authMiddlewareStudent, STUDENT_GET_ALL_COURSE_RATING)
.post(authMiddlewareStudent, STUDENT_POST_COURSE_RATING)

router.route("/student-course-rating/:id")
.get(authMiddlewareStudent, STUDENT_GET_SINGLE_COURSE_RATING)
.put(authMiddlewareStudent, STUDENT_UPDATE_COURSE_RATING)
.delete(authMiddlewareStudent, STUDENT_DELETE_COURSE_RATING)

module.exports = router