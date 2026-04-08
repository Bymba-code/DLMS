const express = require("express")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const STUDENT_GET_ALL_PAYMENT = require("../../controllers/45. CourseStudentPayment/1. GET_ALL")
const STUDENT_POST_PAYMENT = require("../../controllers/45. CourseStudentPayment/3. POST")
const STUDENT_GET_SINGLE_PAYMENT = require("../../controllers/45. CourseStudentPayment/2. GET_SINGLE")

const router = express.Router()

router.route("/course-student-payment")
.get(authMiddlewareStudent, STUDENT_GET_ALL_PAYMENT)
.post(authMiddlewareStudent, STUDENT_POST_PAYMENT)

router.route("/course-student-payment/:id")
.get(authMiddlewareStudent, STUDENT_GET_SINGLE_PAYMENT)

module.exports = router