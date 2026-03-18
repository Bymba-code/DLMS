const express = require("express")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const GET_ALL_TEACHER = require("../../controllers/18. Teacher/1. GET_ALL")
const GET_SINGLE_TEACHER = require("../../controllers/18. Teacher/2. GET_SINGLE")
const POST_TEACHER = require("../../controllers/18. Teacher/3. POST")
const UPDATE_TEACHER = require("../../controllers/18. Teacher/4. UPDATE")
const DELETE_TEACHER = require("../../controllers/18. Teacher/5. DELETE")
const COURSE_GET_ALL_TEACHER = require("../../controllers/18. Teacher/6. GET_ALL_COURSE")
const COURSE_GET_SINGLE_TEACHER = require("../../controllers/18. Teacher/7. GET_SINGLE_COURSE")
const COURSE_POST_TEACHER = require("../../controllers/18. Teacher/8. COURSE_POST")
const COURSE_UPDATE_TEACHER = require("../../controllers/18. Teacher/9. COURSE_UPDATE")
const COURSE_DELETE_TEACHER = require("../../controllers/18. Teacher/10. COURSE_DELETE")
const LOGIN_TEACHER = require("../../controllers/18. Teacher/11. LOGIN")
const authMiddlewareTeacher = require("../../middlewares/teacherCookieAuth")
const ME_TEACHER = require("../../controllers/18. Teacher/12. ME")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const checkSubscription = require("../../middlewares/subscriptionPlan")

const router = express.Router()

router.route("/teacher")
.get(GET_ALL_TEACHER)
.post(POST_TEACHER)

router.route("/teacher/:id")
.get(GET_SINGLE_TEACHER)
.put(UPDATE_TEACHER)
.delete(DELETE_TEACHER)

router.route("/autoschool/teacher")
.get(authMiddlewareUser, checkSubscription,  COURSE_GET_ALL_TEACHER)
.post(authMiddlewareUser, checkSubscription,  COURSE_POST_TEACHER)

router.route("/autoschool/teacher/:id")
.get(authMiddlewareUser, checkSubscription,  COURSE_GET_SINGLE_TEACHER)
.put(authMiddlewareUser, checkSubscription,  COURSE_UPDATE_TEACHER)
.delete(authMiddlewareUser, checkSubscription,  COURSE_DELETE_TEACHER)

router.route("/me/teacher")
.get(authMiddlewareTeacher, ME_TEACHER)

router.route("/auth/login/teacher")
.post(LOGIN_TEACHER)


module.exports = router