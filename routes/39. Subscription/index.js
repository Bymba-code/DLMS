const express = require("express")
const COURSE_GET_ALL_SUBSCRIPTION_PLAN = require("../../controllers/39. Subscription/1. GET_ALL")
const POST_COURSE_SUBSCRIPTION_PLAN = require("../../controllers/39. Subscription/3. POST")
const COURSE_GET_SINGLE_SUBSCRIPTION_PLAN = require("../../controllers/39. Subscription/2. GET_SINGLE")
const COURSE_UPDATE_SUBSCRIPTION_PLAN = require("../../controllers/39. Subscription/4. UPDATE")
const DELETE_COURSE_SUBSCRIPTION_PLAN = require("../../controllers/39. Subscription/5. DELETE")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")

const router = express.Router()

router.route("/autoschool/subscription-plan")
.get(authMiddlewareUser, COURSE_GET_ALL_SUBSCRIPTION_PLAN)
.post(authMiddlewareUser, POST_COURSE_SUBSCRIPTION_PLAN)

router.route("/autoschool/subscription-plan/:id")
.get(authMiddlewareUser, COURSE_GET_SINGLE_SUBSCRIPTION_PLAN)
.put(authMiddlewareUser, COURSE_UPDATE_SUBSCRIPTION_PLAN)
.delete(authMiddlewareUser, DELETE_COURSE_SUBSCRIPTION_PLAN)

module.exports = router