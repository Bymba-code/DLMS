const express = require("express")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const GET_ALL_COURSE_INTAKE = require("../../controllers/42. Intake/1. GET_ALL")
const POST_COURSE_INTAKE = require("../../controllers/42. Intake/3. POST")
const GET_SINGLE_COURSE_INTAKE = require("../../controllers/42. Intake/2. GET_SINGLE")
const UPDATE_COURSE_INTAKE = require("../../controllers/42. Intake/4. UPDATE")
const checkSubscription = require("../../middlewares/subscriptionPlan")
const DELETE_COURSE_INTAKE = require("../../controllers/42. Intake/5. DELETE")

const router = express.Router()

router.route("/course-intake")
.get(authMiddlewareUser, checkSubscription, GET_ALL_COURSE_INTAKE)
.post(authMiddlewareUser, checkSubscription,  POST_COURSE_INTAKE)

router.route("/course-intake/:id")
.get(authMiddlewareUser, checkSubscription, GET_SINGLE_COURSE_INTAKE)
.put(authMiddlewareUser, checkSubscription, UPDATE_COURSE_INTAKE)
.delete(authMiddlewareUser, checkSubscription, DELETE_COURSE_INTAKE)

module.exports = router