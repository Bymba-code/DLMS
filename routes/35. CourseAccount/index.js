const express = require("express")
const GET_ALL_COURSE_ACCOUNT = require("../../controllers/35. CourseAccount/1. GET_ALL")
const POST_COURSE_ACCOUNT = require("../../controllers/35. CourseAccount/3. POST")
const GET_SINGLE_COURSE_ACCOUNT = require("../../controllers/35. CourseAccount/2. GET_SINGLE")
const UPDATE_COURSE_ACCOUNT = require("../../controllers/35. CourseAccount/4. UPDATE")
const DELETE_COURSE_ACCOUNT = require("../../controllers/35. CourseAccount/5. DELETE")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const OWNER_GET_ALL_COURSE_ACCOUNT = require("../../controllers/35. CourseAccount/6. OWNER_GET_ALL")
const OWNER_POST_COURSE_ACCOUNT = require("../../controllers/35. CourseAccount/8. OWNER_POST")
const OWNER_GET_SINGLE_COURSE_ACCOUNT = require("../../controllers/35. CourseAccount/7. OWNER_GET_SINGLE")
const OWNER_UPDATE_COURSE_ACCOUNT = require("../../controllers/35. CourseAccount/9. OWNER_UPDATE")
const OWNER_DELETE_COURSE_ACCOUNT = require("../../controllers/35. CourseAccount/10. OWNER_DELETE")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const checkSubscription = require("../../middlewares/subscriptionPlan")

const router = express.Router()

router.route("/course-account")
.get(GET_ALL_COURSE_ACCOUNT)
.post(POST_COURSE_ACCOUNT)

router.route("/course-account/:id")
.get(GET_SINGLE_COURSE_ACCOUNT)
.put(UPDATE_COURSE_ACCOUNT)
.delete(DELETE_COURSE_ACCOUNT)

router.route("/autoschool/course-account")
.get(authMiddlewareUser, checkSubscription,  OWNER_GET_ALL_COURSE_ACCOUNT)
.post(authMiddlewareUser, checkSubscription,  OWNER_POST_COURSE_ACCOUNT)

router.route("/autoschool/course-account/:id")
.get(authMiddlewareUser, checkSubscription,  OWNER_GET_SINGLE_COURSE_ACCOUNT)
.put(authMiddlewareUser, checkSubscription,  OWNER_UPDATE_COURSE_ACCOUNT)
.delete(authMiddlewareUser, checkSubscription,  OWNER_DELETE_COURSE_ACCOUNT)


module.exports = router