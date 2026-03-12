const express = require("express")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const authMiddlewareTeacher = require("../../middlewares/teacherCookieAuth")
const GET_ALL_STUDENT_SCHEDULE = require("../../controllers/19. StudentSchedule/1. GET_ALL")
const GET_SINGLE_STUDENT_SCHEDULE = require("../../controllers/19. StudentSchedule/2. GET_SINGLE")
const POST_STUDENT_SCHEDULE = require("../../controllers/19. StudentSchedule/3. POST")
const UPDATE_STUDENT_SCHEDULE = require("../../controllers/19. StudentSchedule/4. UPDATE")
const DELETE_STUDENT_SCHEDULE = require("../../controllers/19. StudentSchedule/5. DELETE")
const STUDENT_GET_ALL_SCHEDULE = require("../../controllers/19. StudentSchedule/6. STUDENT_GET_ALL")
const STUDENT_GET_SINGLE_SCHEDULE = require("../../controllers/19. StudentSchedule/7. STUDENT_GET_SINGLE")
const TEACHER_POST_STUDENT_SCHEDULE = require("../../controllers/19. StudentSchedule/8. TEACHER_POST")
const TEACHER_UPDATE_STUDENT_SCHEDULE = require("../../controllers/19. StudentSchedule/9. TEACHER_UPDATE")

const router = express.Router()

router.route("/student-schedule")
.get(GET_ALL_STUDENT_SCHEDULE)
.post(POST_STUDENT_SCHEDULE) // Хуваарь холбох

router.route("/student-schedule/:id")
.get(GET_SINGLE_STUDENT_SCHEDULE)
.put(UPDATE_STUDENT_SCHEDULE) // Ирц бүртгэх
.delete(DELETE_STUDENT_SCHEDULE)

router.route("/student/student-schedule")
.get(authMiddlewareStudent, STUDENT_GET_ALL_SCHEDULE)

router.route("/student/student-schedule/:id")
.get(authMiddlewareStudent, STUDENT_GET_SINGLE_SCHEDULE)

router.route("/teacher/student-schedule")
.post(authMiddlewareTeacher, TEACHER_POST_STUDENT_SCHEDULE)


router.route("/teacher/student-schedule/:id")
.put(authMiddlewareTeacher, TEACHER_UPDATE_STUDENT_SCHEDULE)



module.exports = router