const express = require("express")
const GET_ALL_COURSE = require("../../controllers/1. Course/1. GET_ALL")
const GET_SINGLE_COURSE = require("../../controllers/1. Course/2. GET_SINGLE")
const POST_COURSE = require("../../controllers/1. Course/3. POST")
const UPDATE_COURSE = require("../../controllers/1. Course/4. UPDATE")
const DELETE_COURSE = require("../../controllers/1. Course/5. DELETE")
const LOGIN_COURSE = require("../../controllers/1. Course/6. LOGIN")
const ME_COURSE = require("../../controllers/1. Course/7. ME")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const STAT_COURSE = require("../../controllers/1. Course/8. STAT")
const LOGOUT_COURSE = require("../../controllers/1. Course/9. LOGOUT")

const router = express.Router()

router.route("/course")
.get(GET_ALL_COURSE)
.post(POST_COURSE)
.put(authMiddlewareUser, UPDATE_COURSE)


router.route("/course/:id")
.get(GET_SINGLE_COURSE)
.delete(DELETE_COURSE)

router.route("/auth/login/course")
.post(LOGIN_COURSE)

router.route("/me/course")
.get(authMiddlewareUser, ME_COURSE)

router.route("/stat/course")
.get(authMiddlewareUser, STAT_COURSE)

router.route("/auth/logout/course")
.get(authMiddlewareCourse, LOGOUT_COURSE)

module.exports = router