const express = require("express")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const authMiddlewareTeacher = require("../../middlewares/teacherCookieAuth")
const GET_ALL_MESSAGES = require("../../controllers/23. Messages/1. GET_ALL")
const POST_MESSAGE = require("../../controllers/23. Messages/3. POST")
const GET_SINGLE_MESSAGE = require("../../controllers/23. Messages/2. GET_SINGLE")
const UPDATE_MESSAGE = require("../../controllers/23. Messages/4. UPDATE")
const DELETE_MESSAGE = require("../../controllers/23. Messages/5. DELETE")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const COURSE_GET_ALL_MESSAGE = require("../../controllers/23. Messages/6. GET_ALL_COURSE")
const COURSE_GET_SINGLE_MESSAGE = require("../../controllers/23. Messages/7. GET_SINGLE_COURSE")
const COURSE_POST_MESSAGE = require("../../controllers/23. Messages/8. COURSE_POST")
const COURSE_UPDATE_MESSAGE = require("../../controllers/23. Messages/9. COURSE_UPDATE")
const COURSE_DELETE_MESSAGE = require("../../controllers/23. Messages/10. COURSE_DELETE")
const STUDENT_GET_ALL_MESSAGE = require("../../controllers/23. Messages/11. STUDENT_GET_ALL")
const STUDENT_GET_SINGLE_MESSAGE = require("../../controllers/23. Messages/12. STUDENT_GET_SINGLE")
const STUDENT_UPDATE_MESSAGE = require("../../controllers/23. Messages/13. STUDENT_UPDATE")
const STUDENT_GET_MESSAGE_COUNT = require("../../controllers/23. Messages/14. STUDENT_COUNT")
const checkSubscription = require("../../middlewares/subscriptionPlan")

const router = express.Router()

router.route("/message")
.get(GET_ALL_MESSAGES)
.post(POST_MESSAGE)

router.route("/message/:id")
.get(GET_SINGLE_MESSAGE)
.put(UPDATE_MESSAGE)
.delete(DELETE_MESSAGE)

router.route("/autoschool/message")
.get(authMiddlewareUser, checkSubscription, COURSE_GET_ALL_MESSAGE)
.post(authMiddlewareUser, checkSubscription, COURSE_POST_MESSAGE)

router.route("/autoschool/message/:id")
.get(authMiddlewareUser, checkSubscription, COURSE_GET_SINGLE_MESSAGE)
.put(authMiddlewareUser, checkSubscription, COURSE_UPDATE_MESSAGE)
.delete(authMiddlewareUser, checkSubscription, COURSE_DELETE_MESSAGE)

router.route("/student/message")
.get(authMiddlewareStudent, STUDENT_GET_ALL_MESSAGE)

router.route("/student/message/:id")
.get(authMiddlewareStudent, STUDENT_GET_SINGLE_MESSAGE)
.put(authMiddlewareStudent, STUDENT_UPDATE_MESSAGE)

router.route("/student/message-count")
.get(authMiddlewareStudent, STUDENT_GET_MESSAGE_COUNT)


module.exports = router