const express = require("express")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const GET_ALL_EXAM = require("../../controllers/15. Exam/1. GET_ALL")
const GET_SINGLE_EXAM = require("../../controllers/15. Exam/2. GET_SINGLE")
const DELETE_EXAM = require("../../controllers/15. Exam/3. DELETE")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const COURSE_GET_ALL_EXAM = require("../../controllers/15. Exam/4. COURSE_GET_ALL")
const COURSE_GET_SINGLE_EXAM = require("../../controllers/15. Exam/5. COURSE_GET_SINGLE")
const COURSE_DELETE_EXAM = require("../../controllers/15. Exam/6. COURSE_DELETE")
const STUDENT_GET_ALL_EXAM = require("../../controllers/15. Exam/7. STUDENT_GET_ALL")
const STUDENT_GET_SINGLE_EXAM = require("../../controllers/15. Exam/8. STUDENT_GET_SINGLE")
const STUDENT_POST_EXAM = require("../../controllers/15. Exam/9. STUDENT_POST")
const STUDENT_UPDATE_EXAM = require("../../controllers/15. Exam/10. STUDENT_UPDATE")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const checkSubscription = require("../../middlewares/subscriptionPlan")

const router = express.Router()

router.route("/exam")
.get(GET_ALL_EXAM)

router.route("/exam/:id")
.get(GET_SINGLE_EXAM)
.delete(DELETE_EXAM)

router.route("/autoschool/exam")
.get(authMiddlewareUser, checkSubscription,  COURSE_GET_ALL_EXAM)

router.route("/autoschool/exam/:id")
.get(authMiddlewareUser, checkSubscription,  COURSE_GET_SINGLE_EXAM)
.delete(authMiddlewareUser, checkSubscription,  COURSE_DELETE_EXAM)

router.route("/student/exam")
.get(authMiddlewareStudent, STUDENT_GET_ALL_EXAM)
.post(authMiddlewareStudent, STUDENT_POST_EXAM)

router.route("/student/exam/:id")
.get(authMiddlewareStudent, STUDENT_GET_SINGLE_EXAM)
.put(authMiddlewareStudent, STUDENT_UPDATE_EXAM)

module.exports = router