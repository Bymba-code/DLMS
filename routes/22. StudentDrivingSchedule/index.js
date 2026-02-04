const express = require("express")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const authMiddlewareTeacher = require("../../middlewares/teacherCookieAuth")
const GET_ALL_STUDENT_DRIVING_SCHEDULE = require("../../controllers/22. StudentDrivingSchedule/1. GET_ALL")
const GET_SINGLE_STUDENT_DRIVING_SCHEDULE = require("../../controllers/22. StudentDrivingSchedule/2. GET_SINGLE")
const POST_STUDENT_DRIVING_SCHEDULE = require("../../controllers/22. StudentDrivingSchedule/3. POST")
const UPDATE_STUDENT_DRIVING_SCHEDULE = require("../../controllers/22. StudentDrivingSchedule/4. UPDATE")
const DELETE_STUDENT_DRIVING_SCHEDULE = require("../../controllers/22. StudentDrivingSchedule/5. DELETE")
const STUDENT_GET_ALL_DRIVING_SCHEDULE = require("../../controllers/22. StudentDrivingSchedule/6. STUDENT_GET_ALL")
const TEACHER_POST_STUDENT_DRIVING_SCHEDULE = require("../../controllers/22. StudentDrivingSchedule/8. TEACHER_POST")
const TEACHER_UPDATE_DRIVING_SCHEDULE = require("../../controllers/22. StudentDrivingSchedule/9. TEACHER_UPDATE")

const router = express.Router()

router.route("/student-driving-schedule")
.get(GET_ALL_STUDENT_DRIVING_SCHEDULE)
.post(POST_STUDENT_DRIVING_SCHEDULE)

router.route("/student-driving-schedule/:id")
.get(GET_SINGLE_STUDENT_DRIVING_SCHEDULE)
.put(UPDATE_STUDENT_DRIVING_SCHEDULE)
.delete(DELETE_STUDENT_DRIVING_SCHEDULE)

router.route("/student/student-driving-schedule")
.get(authMiddlewareStudent, STUDENT_GET_ALL_DRIVING_SCHEDULE)

router.route("/student/student-driving-schedule/:id")
.get(authMiddlewareStudent, GET_SINGLE_STUDENT_DRIVING_SCHEDULE)

router.route("/teachers/student-driving-schedule")
.post(authMiddlewareTeacher, TEACHER_POST_STUDENT_DRIVING_SCHEDULE)

router.route("/teachers/student-driving-schedule/:id")
.put(authMiddlewareStudent, TEACHER_UPDATE_DRIVING_SCHEDULE)

module.exports = router