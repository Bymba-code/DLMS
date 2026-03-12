const express = require("express")
const COURSE_GET_ALL_STUDENT_DETAILS = require("../../controllers/31. CourseStudentDetails/1. COURSE_GET_ALL")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const COURSE_GET_SINGLE_STUDENT_DETAILS = require("../../controllers/31. CourseStudentDetails/2. COURSE_GET_SINGLE")
const COURSE_POST_STUDENT_DETAILS = require("../../controllers/31. CourseStudentDetails/3. COURSE_POST")
const COURSE_UPDATE_STUDENT_DETAILS = require("../../controllers/31. CourseStudentDetails/4. COURSE_UPDATE")
const COURSE_DELETE_STUDENT_DETAILS = require("../../controllers/31. CourseStudentDetails/5. COURSE_DELETE")
const STUDENT_GET_ALL_DETAILS = require("../../controllers/31. CourseStudentDetails/6. STUDENT_GET_ALL")
const STUDENT_GET_SINGLE_DETAILS = require("../../controllers/31. CourseStudentDetails/7. STUDENT_GET_SINGLE")
const STUDENT_POST_DETAILS = require("../../controllers/31. CourseStudentDetails/8. STUDENT_POST")
const STUDENT_UPDATE_DETAILS = require("../../controllers/31. CourseStudentDetails/9. STUDENT_UPDATE")
const STUDENT_DELETE_DETAILS = require("../../controllers/31. CourseStudentDetails/10. STUDENT_DELETE")

const router = express.Router()

router.route("/admin/course-student-details")
.get(authMiddlewareUser, COURSE_GET_ALL_STUDENT_DETAILS)
.post(authMiddlewareUser, COURSE_POST_STUDENT_DETAILS)

router.route("/admin/course-student-details/:id")
.get(authMiddlewareUser, COURSE_GET_SINGLE_STUDENT_DETAILS)
.put(authMiddlewareUser, COURSE_UPDATE_STUDENT_DETAILS)
.delete(authMiddlewareUser, COURSE_DELETE_STUDENT_DETAILS)

router.route("/student/course-student-details")
.get(authMiddlewareStudent, STUDENT_GET_ALL_DETAILS)
.post(authMiddlewareStudent, STUDENT_POST_DETAILS)

router.route("/student/course-student-details/:id")
.get(authMiddlewareStudent, STUDENT_GET_SINGLE_DETAILS)
.put(authMiddlewareStudent, STUDENT_UPDATE_DETAILS)
.delete(authMiddlewareStudent, STUDENT_DELETE_DETAILS)

module.exports = router