const express = require("express")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const STUDENT_GET_ALL_CATEGORY = require("../../controllers/9. CourseStudentCategory/1. GET_ALL_STUDENT")

const router = express.Router()

router.route("/course-student")

router.route("/course-student/:id")

router.route("/student/course-student-category")
.get(authMiddlewareStudent, STUDENT_GET_ALL_CATEGORY)

router.route("/autoschool/course-student/:id")

module.exports = router