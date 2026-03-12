const express = require("express")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const authMiddlewareTeacher = require("../../middlewares/teacherCookieAuth")
const GET_ALL_DRIVING_SCHEDULE = require("../../controllers/21. DrivingSchedule/1. GET_ALL")
const GET_SINGLE_DRIVING_SCHEDULE = require("../../controllers/21. DrivingSchedule/2. GET_SINGLE")
const POST_DRIVING_SCHEDULE = require("../../controllers/21. DrivingSchedule/3. POST")
const UPDATE_DRIVING_SCHEDULE = require("../../controllers/21. DrivingSchedule/4. UPDATE")
const DELETE_DRIVING_SCHEDULE = require("../../controllers/21. DrivingSchedule/5. DELETE")
const COURSE_GET_ALL_DRIVING_SCHEDULE = require("../../controllers/21. DrivingSchedule/6. GET_ALL_COURSE")
const COURSE_POST_DRIVING_SCHEDULE = require("../../controllers/21. DrivingSchedule/8. COURSE_POST")
const COURSE_UPDATE_DRIVING_SCHEDULE = require("../../controllers/21. DrivingSchedule/9. COURSE_UPDATE")
const COURSE_DELETE_DRIVING_SCHEDULE = require("../../controllers/21. DrivingSchedule/10. COURSE_DELETE")
const TEACHER_GET_ALL_DRIVING_SCHEDULE = require("../../controllers/21. DrivingSchedule/11. TEACHER_ALL")
const TEACHER_GET_SINGLE_DRIVING_SCHEDULE = require("../../controllers/21. DrivingSchedule/12. TEACHER_SINGLE")
const TEACHER_POST_DRIVING_SCHEDULE = require("../../controllers/21. DrivingSchedule/13. TEACHER_POST")
const TEACHER_UPDATE_DRIVING_SCHEDULE = require("../../controllers/21. DrivingSchedule/14. TEACHER_UPDATE")
const TEACHER_DELETE_DRIVING_SCHEDULE = require("../../controllers/21. DrivingSchedule/15. TEACHER_DELETE")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")


const router = express.Router()

router.route("/driving-schedule")
.get(GET_ALL_DRIVING_SCHEDULE)
.post(POST_DRIVING_SCHEDULE)

router.route("/driving-schedule/:id")
.get(GET_SINGLE_DRIVING_SCHEDULE)
.put(UPDATE_DRIVING_SCHEDULE)
.delete(DELETE_DRIVING_SCHEDULE)

router.route("/autoschool/driving-schedule")
.get(authMiddlewareUser, COURSE_GET_ALL_DRIVING_SCHEDULE)
.post(authMiddlewareUser, COURSE_POST_DRIVING_SCHEDULE)

router.route("/autoschool/driving-schedule/:id")
.get(authMiddlewareUser, GET_SINGLE_DRIVING_SCHEDULE)
.put(authMiddlewareUser, COURSE_UPDATE_DRIVING_SCHEDULE)
.delete(authMiddlewareUser, COURSE_DELETE_DRIVING_SCHEDULE)

router.route("/teachers/driving-schedule")
.get(authMiddlewareTeacher, TEACHER_GET_ALL_DRIVING_SCHEDULE)
.post(authMiddlewareTeacher, TEACHER_POST_DRIVING_SCHEDULE)

router.route("/teachers/driving-schedule/:id")
.get(authMiddlewareTeacher, TEACHER_GET_SINGLE_DRIVING_SCHEDULE)
.put(authMiddlewareTeacher, TEACHER_UPDATE_DRIVING_SCHEDULE)
.delete(authMiddlewareTeacher, TEACHER_DELETE_DRIVING_SCHEDULE)


module.exports = router