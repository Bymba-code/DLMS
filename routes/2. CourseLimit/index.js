const express = require("express")
const GET_ALL_COURSE_LIMIT_INVOICE = require("../../controllers/2. CourseLimit/1. GET_ALL")
const GET_SINGLE_COURSE_LIMIT_INVOICE = require("../../controllers/2. CourseLimit/2. GET_SINGLE")
const POST_COURSE_LIMIT_INVOICE = require("../../controllers/2. CourseLimit/3. POST")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const COURSE_GET_ALL_LIMIT_INVOICE = require("../../controllers/2. CourseLimit/6. GET_ALL_COURSE")
const COURSE_GET_SINGLE_LIMIT_INVOICE = require("../../controllers/2. CourseLimit/7. GET_SINGLE_COURSE")
const COURSE_POST_LIMIT_INVOICE = require("../../controllers/2. CourseLimit/8. COURSE_POST")
const COURSE_UPDATE_LIMIT_INVOICE = require("../../controllers/2. CourseLimit/9. UPDATE")

const router = express.Router()

router.route("/course-limit")
.get(GET_ALL_COURSE_LIMIT_INVOICE)
.post(POST_COURSE_LIMIT_INVOICE)

router.route("/course-limit/:id")
.get(GET_SINGLE_COURSE_LIMIT_INVOICE)

router.route("/autoschool/course-limit")
.get(authMiddlewareCourse, COURSE_GET_ALL_LIMIT_INVOICE)
.post(authMiddlewareCourse, COURSE_POST_LIMIT_INVOICE)

router.route("/autoschool/course-limit/:id")
.get(authMiddlewareCourse, COURSE_GET_SINGLE_LIMIT_INVOICE)
.put(authMiddlewareCourse, COURSE_UPDATE_LIMIT_INVOICE)



module.exports = router