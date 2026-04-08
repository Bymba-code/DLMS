const express = require("express")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const COURSE_POST_GROUP_STUDENT = require("../../controllers/43. CourseGroupStudent/1. POST")
const COURSE_DELETE_GROUP_STUDENT = require("../../controllers/43. CourseGroupStudent/2. DELETE")

const router = express.Router()

router.route("/autoschool/course-group-student")
.post(authMiddlewareUser, COURSE_POST_GROUP_STUDENT)

router.route("/autoschool/course-group-student/:id")
.delete(authMiddlewareUser, COURSE_DELETE_GROUP_STUDENT)

module.exports = router