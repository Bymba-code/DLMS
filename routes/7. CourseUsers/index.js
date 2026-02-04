const express = require("express")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const GET_ALL_COURSE_USER = require("../../controllers/7. CourseUsers/1. GET_ALL")
const GET_SINGLE_COURSE_USER = require("../../controllers/7. CourseUsers/2. GET_SINGLE")
const POST_COURSE_USERS = require("../../controllers/7. CourseUsers/3. POST")
const UPDATE_COURSE_USER = require("../../controllers/7. CourseUsers/4. UPDATE")
const DELETE_COURSE_USER = require("../../controllers/7. CourseUsers/5. DELETE")
const COURSE_GET_ALL_USER = require("../../controllers/7. CourseUsers/6. GET_ALL_COURSE")
const COURSE_GET_SINGLE_USER = require("../../controllers/7. CourseUsers/7. GET_SINGLE_COURSE")
const COURSE_POST_USER = require("../../controllers/7. CourseUsers/8. COURSE_POST")
const LOGIN_USER = require("../../controllers/7. CourseUsers/11. LOGIN")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const ME_USER = require("../../controllers/7. CourseUsers/12. ME")

const router = express.Router()

router.route("/course-user")
.get(GET_ALL_COURSE_USER)
.post(POST_COURSE_USERS)

router.route("/course-user/:id")
.get(GET_SINGLE_COURSE_USER)
.put(UPDATE_COURSE_USER)
.delete(DELETE_COURSE_USER)

router.route("/autoschool/course-user")
.get(authMiddlewareCourse, COURSE_GET_ALL_USER)
.post(authMiddlewareCourse, COURSE_POST_USER)

router.route("/autoschool/course-user/:id")
.get(authMiddlewareCourse, COURSE_GET_SINGLE_USER)
.put(authMiddlewareCourse, UPDATE_COURSE_USER)
.delete(authMiddlewareCourse, DELETE_COURSE_USER)

router.route("/auth/login/user")
.post(LOGIN_USER)

router.route("/me/user")
.get(authMiddlewareUser, ME_USER)


module.exports = router