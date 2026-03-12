const express = require("express")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const COURSE_POST_STUDENT_ACCESS = require("../../controllers/37. CourseStudentAccess/1. COURSE_POST")
const COURSE_UPDATE_STUDENT_ACCESS = require("../../controllers/37. CourseStudentAccess/2. COURSE_UPDATE")
const COURSE_DELETE_STUDENT_ACCESS = require("../../controllers/37. CourseStudentAccess/5. COURSE_DELETE")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")

const router = express.Router()

router.route("/admin/course-student-access")
.post(authMiddlewareUser, COURSE_POST_STUDENT_ACCESS)

router.route("/admin/course-student-access/:id")
.put(authMiddlewareUser, COURSE_UPDATE_STUDENT_ACCESS)
.delete(authMiddlewareUser, COURSE_DELETE_STUDENT_ACCESS)

module.exports = router