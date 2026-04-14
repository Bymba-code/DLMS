const express = require("express")
const GET_ALL_COURSE_STUDENT = require("../../controllers/8. CourseStudent/1. GET_ALL")
const POST_COURSE_STUDENT = require("../../controllers/8. CourseStudent/3. POST")
const GET_SINGLE_COURSE_STUDENT = require("../../controllers/8. CourseStudent/2. GET_SINGLE")
const UPDATE_COURSE_STUDENT = require("../../controllers/8. CourseStudent/4. UPDATE")
const DELETE_COURSE_STUDENT = require("../../controllers/8. CourseStudent/5. DELETE")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const COURSE_GET_ALL_STUDENT = require("../../controllers/8. CourseStudent/6. GET_ALL_COURSE")
const COURSE_GET_SINGLE_STUDENT = require("../../controllers/8. CourseStudent/7. GET_SINGLE_COURSE")
const COURSE_POST_STUDENT = require("../../controllers/8. CourseStudent/8. COURSE_POST")
const COURSE_UPDATE_STUDENT = require("../../controllers/8. CourseStudent/9. COURSE_UPDATE")
const COURSE_DELETE_STUDENT = require("../../controllers/8. CourseStudent/10. COURSE_DELETE")
const LOGIN_STUDENT = require("../../controllers/8. CourseStudent/11. LOGIN")
const ME_STUDENT = require("../../controllers/8. CourseStudent/12. ME")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const STUDENT_GET_STAT = require("../../controllers/8. CourseStudent/13. STAT")
const COURSE_STUDENT_REPORT = require("../../controllers/8. CourseStudent/14. SystemReport")
const LOGOUT_STUDENT = require("../../controllers/8. CourseStudent/15. LOGOUT")
const checkSubscription = require("../../middlewares/subscriptionPlan")
const ME_STUDENT_TEN_EXAM_AVERATE = require("../../controllers/8. CourseStudent/16. TEN_EXAM_AVERAGE")
const ME_STUDENT_STATUS = require("../../controllers/8. CourseStudent/17. ME_DEDU")

const router = express.Router()

router.route("/course-student")
.get(GET_ALL_COURSE_STUDENT)
.post(POST_COURSE_STUDENT)

router.route("/course-student/:id")
.get(GET_SINGLE_COURSE_STUDENT)
.put(UPDATE_COURSE_STUDENT)
.delete(DELETE_COURSE_STUDENT)

router.route("/autoschool/course-student")
.get(authMiddlewareUser,  checkSubscription, COURSE_GET_ALL_STUDENT)
.post(authMiddlewareUser,  checkSubscription, COURSE_POST_STUDENT)

router.route("/autoschool/course-student/:id")
.get(authMiddlewareUser, checkSubscription, COURSE_GET_SINGLE_STUDENT)
.put(authMiddlewareUser, checkSubscription, COURSE_UPDATE_STUDENT)
.delete(authMiddlewareUser, checkSubscription, COURSE_DELETE_STUDENT)

router.route("/auth/login/student")
.post(LOGIN_STUDENT)

router.route("/me/student")
.get(authMiddlewareStudent, ME_STUDENT)

router.route("/stat/student")
.get(authMiddlewareStudent, STUDENT_GET_STAT)

router.route("/autoschool/report-student")
.get(authMiddlewareUser, COURSE_STUDENT_REPORT)

router.route("/logout/student")
.post(authMiddlewareStudent, LOGOUT_STUDENT)

router.route("/me/student/ten-exam-average")
.get(authMiddlewareStudent, ME_STUDENT_TEN_EXAM_AVERATE)

router.route("/me/student/status")
.get(authMiddlewareStudent, ME_STUDENT_STATUS)

module.exports = router