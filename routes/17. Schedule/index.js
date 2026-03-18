const express = require("express")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const GET_ALL_SCHEDULE = require("../../controllers/17. Schedule/1. GET_ALL")
const GET_SINGLE_SCHEDULE = require("../../controllers/17. Schedule/2. GET_SINGLE")
const POST_SCHEDULE = require("../../controllers/17. Schedule/3. POST")
const UPDATE_SCHEDULE = require("../../controllers/17. Schedule/4. UPDATE")
const DELETE_SCHEDULE = require("../../controllers/17. Schedule/5. DELETE")
const COURSE_GET_ALL_SCHEDULE = require("../../controllers/17. Schedule/6. GET_ALL_COURSE")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const COURSE_GET_SINGLE_SCHEDULE = require("../../controllers/17. Schedule/7. GET_SINGLE_COURSE")
const COURSE_POST_SCHEDULE = require("../../controllers/17. Schedule/8. COURSE_POST")
const COURSE_UPDATE_SCHEDULE = require("../../controllers/17. Schedule/9. COURSE_UPDATE")
const COURSE_DELETE_SCHEDULE = require("../../controllers/17. Schedule/10. COURSE_DELETE")
const authMiddlewareTeacher = require("../../middlewares/teacherCookieAuth")
const TEACHER_GET_ALL_SCHEDULE = require("../../controllers/17. Schedule/11. TEACHER_ALL")
const TEACHER_GET_SINGLE_SCHEDULE = require("../../controllers/17. Schedule/12. TEACHER_SINGLE")
const TEACHER_POST_SCHEDULE = require("../../controllers/17. Schedule/13. TEACHER_POST")
const TEACHER_UPDATE_SCHEDULE = require("../../controllers/17. Schedule/14. TEACHER_UPDATE")
const TEACHER_DELETE_SCHEDULE = require("../../controllers/17. Schedule/15. TEACHER_DELETE")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const checkSubscription = require("../../middlewares/subscriptionPlan")

const router = express.Router()

router.route("/schedule")
.get(GET_ALL_SCHEDULE)
.post(POST_SCHEDULE)

router.route("/schedule/:id")
.get(GET_SINGLE_SCHEDULE)
.put(UPDATE_SCHEDULE)
.delete(DELETE_SCHEDULE)

router.route("/autoschool/schedule")
.get(authMiddlewareUser, checkSubscription,  COURSE_GET_ALL_SCHEDULE)
.post(authMiddlewareUser, checkSubscription,  COURSE_POST_SCHEDULE)

router.route("/autoschool/schedule/:id")
.get(authMiddlewareUser, checkSubscription,  COURSE_GET_SINGLE_SCHEDULE)
.put(authMiddlewareUser, checkSubscription,  COURSE_UPDATE_SCHEDULE)
.delete(authMiddlewareUser, checkSubscription,  COURSE_DELETE_SCHEDULE)

router.route("/teacher/schedule")
.get(authMiddlewareTeacher, TEACHER_GET_ALL_SCHEDULE)
.post(authMiddlewareTeacher, TEACHER_POST_SCHEDULE)

router.route("/teacher/schedule/:id")
.get(authMiddlewareTeacher, TEACHER_GET_SINGLE_SCHEDULE)
.put(authMiddlewareTeacher, TEACHER_UPDATE_SCHEDULE)
.delete(authMiddlewareTeacher, TEACHER_DELETE_SCHEDULE)





module.exports = router