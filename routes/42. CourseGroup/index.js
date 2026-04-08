const express = require("express")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const COURSE_GET_ALL_GROUP = require("../../controllers/42. CourseGroup/1. GET_ALL")
const COURSE_POST_GROUP = require("../../controllers/42. CourseGroup/3. POST")
const COURSE_GET_SINGLE_GROUP = require("../../controllers/42. CourseGroup/2. GET_SINGLE")
const COURSE_UPDATE_GROUP = require("../../controllers/42. CourseGroup/4. UPDATE")
const COURSE_DELETE_GROUP = require("../../controllers/42. CourseGroup/5. DELETE")

const router = express.Router()

router.route("/autoschool/course-group")
.get(authMiddlewareUser, COURSE_GET_ALL_GROUP)
.post(authMiddlewareUser, COURSE_POST_GROUP)

router.route("/autoschool/course-group/:id")
.get(authMiddlewareUser, COURSE_GET_SINGLE_GROUP)
.put(authMiddlewareUser, COURSE_UPDATE_GROUP)
.delete(authMiddlewareUser, COURSE_DELETE_GROUP)

module.exports = router