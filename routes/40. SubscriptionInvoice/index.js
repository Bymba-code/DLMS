const express = require("express")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const COURSE_UPDATE_SUBSCRIPTION_PLAN_INVOICE = require("../../controllers/40. SubscriptionInvoice/4. UPDATE")
const COURSE_GET_ALL_SUBSCRIPTION_INVOICE = require("../../controllers/40. SubscriptionInvoice/1. GET_ALL")
const POST_COURSE_SUBSCRIPTION_INVOICE = require("../../controllers/40. SubscriptionInvoice/3. POST")
const DELETE_COURSE_SUBSCRIPTION_PLAN_INVOICE = require("../../controllers/40. SubscriptionInvoice/5. DELETE")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")

const router = express.Router()

router.route("/autoschool/subscription-plan-invoice")
.get(authMiddlewareUser, COURSE_GET_ALL_SUBSCRIPTION_INVOICE)
.post(authMiddlewareUser, POST_COURSE_SUBSCRIPTION_INVOICE)

router.route("/autoschool/subscription-plan-invoice/:id")
.put(authMiddlewareUser, COURSE_UPDATE_SUBSCRIPTION_PLAN_INVOICE)
.delete(authMiddlewareUser, DELETE_COURSE_SUBSCRIPTION_PLAN_INVOICE)

module.exports = router