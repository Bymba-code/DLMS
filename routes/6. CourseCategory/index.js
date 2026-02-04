const express = require("express")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const GET_ALL_COURSE_CATEGORY = require("../../controllers/6. CourseCategory/1. GET_ALL")
const GET_SINGLE_COURSE_CATEGORY = require("../../controllers/6. CourseCategory/2. GET_SINGLE")
const POST_COURSE_CATEGORY = require("../../controllers/6. CourseCategory/3. POST")
const UPDATE_COURSE_CATEGORY = require("../../controllers/6. CourseCategory/4. UPDATE")
const DELETE_COURSE_CATEGORY = require("../../controllers/6. CourseCategory/5. DELETE")
const COURSE_GET_ALL_CATEGORY = require("../../controllers/6. CourseCategory/6. GET_ALL_COURSE")
const COURSE_GET_SINGLE_CATEGORY = require("../../controllers/6. CourseCategory/7. GET_SINGLE_COURSE")
const COURSE_POST_CATEGORY = require("../../controllers/6. CourseCategory/8. COURSE_POST")
const COURSE_UPDATE_CATEGORY = require("../../controllers/6. CourseCategory/9. COURSE_UPDATE")
const COURSE_DELETE_CATEGORY = require("../../controllers/6. CourseCategory/10. COURSE_DELETE")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const ADMIN_GET_ALL_CATEGORY = require("../../controllers/6. CourseCategory/11. ADMIN")

const router = express.Router()

router.route("/course-category")
.get(GET_ALL_COURSE_CATEGORY)
.post(POST_COURSE_CATEGORY)

router.route("/course-category/:id")
.get(GET_SINGLE_COURSE_CATEGORY)
.put(UPDATE_COURSE_CATEGORY)
.delete(DELETE_COURSE_CATEGORY)

router.route("/autoschool/course-category")
.get(authMiddlewareCourse, COURSE_GET_ALL_CATEGORY)
.post(authMiddlewareCourse, COURSE_POST_CATEGORY)

router.route("/autoschool/course-category/:id")
.get(authMiddlewareCourse, COURSE_GET_SINGLE_CATEGORY)
.put(authMiddlewareCourse, COURSE_UPDATE_CATEGORY)
.delete(authMiddlewareCourse, COURSE_DELETE_CATEGORY)

router.route("/admin/course-category")
.get(authMiddlewareUser, ADMIN_GET_ALL_CATEGORY)

module.exports = router