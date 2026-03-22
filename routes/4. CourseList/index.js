const express = require("express")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const GET_ALL_COURSE_LIST = require("../../controllers/4. CourseList/1. GET_ALL")
const GET_SINGLE_COURSE_LIST = require("../../controllers/4. CourseList/2. GET_SINGLE")
const POST_COURSE_LIST = require("../../controllers/4. CourseList/3. POST")
const UPDATE_COURSE_LIST = require("../../controllers/4. CourseList/4. UPDATE")
const DELETE_COURSE_LIST = require("../../controllers/4. CourseList/5. DELETE")
const COURSE_GET_ALL_LIST = require("../../controllers/4. CourseList/6. GET_ALL_COURSE")
const COURSE_GET_SINGLE_LIST = require("../../controllers/4. CourseList/7. GET_SINGLE_COURSE")
const COURSE_POST_LIST = require("../../controllers/4. CourseList/8. COURSE_POST")
const COURSE_DELETE_LIST = require("../../controllers/4. CourseList/10. COURSE_DELETE")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")

const router = express.Router()

router.route("/course-list")
.get(GET_ALL_COURSE_LIST)
.post(POST_COURSE_LIST)

router.route("/course-list/:id")
.get(GET_SINGLE_COURSE_LIST)
.put(UPDATE_COURSE_LIST)
.delete(DELETE_COURSE_LIST)

router.route("/autoschool/course-list")
.get(authMiddlewareUser, COURSE_GET_ALL_LIST)
.post(authMiddlewareUser, COURSE_POST_LIST)

router.route("/autoschool/course-list/:id")
.get(authMiddlewareUser, COURSE_GET_SINGLE_LIST)
.put(authMiddlewareUser, UPDATE_COURSE_LIST   )
.delete(authMiddlewareUser, COURSE_DELETE_LIST)


module.exports = router