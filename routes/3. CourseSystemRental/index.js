const express = require("express")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const GET_ALL_COURSE_SYSTEM_RENTAL = require("../../controllers/3. CourseSystemRental/1. GET_ALL")
const GET_SINGLE_COURSE_SYSTEM_RENTAL = require("../../controllers/3. CourseSystemRental/2. GET_SINGLE")
const POST_COURSE_SYSTEM_RENTAL = require("../../controllers/3. CourseSystemRental/3. POST")
const UPDATE_COURSE_SYSTEM_RENTAL = require("../../controllers/3. CourseSystemRental/4. UPDATE")
const COURSE_GET_ALL_SYSTEM_RENTAL = require("../../controllers/3. CourseSystemRental/6. GET_ALL_COURSE")
const COURSE_GET_SINGLE_SYSTEM_RENTAL = require("../../controllers/3. CourseSystemRental/7. GET_SINGLE_COURSE")
const COURSE_POST_SYSTEM_RENTAL = require("../../controllers/3. CourseSystemRental/8. COURSE_POST")

const router = express.Router()

router.route("/course-system-rental")
.get(GET_ALL_COURSE_SYSTEM_RENTAL)
.post(POST_COURSE_SYSTEM_RENTAL)

router.route("/course-system-rental/:id")
.get(GET_SINGLE_COURSE_SYSTEM_RENTAL)
.put(UPDATE_COURSE_SYSTEM_RENTAL)

router.route("/autoschool/course-system-rental")
.get(authMiddlewareCourse, COURSE_GET_ALL_SYSTEM_RENTAL)
.post(authMiddlewareCourse, COURSE_POST_SYSTEM_RENTAL)

router.route("/autoschool/course-system-rental/:id")
.get(authMiddlewareCourse, COURSE_GET_SINGLE_SYSTEM_RENTAL)
.put(authMiddlewareCourse, UPDATE_COURSE_SYSTEM_RENTAL)


module.exports = router