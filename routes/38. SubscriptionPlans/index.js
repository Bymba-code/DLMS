const express = require("express")
const GET_ALL_SUBSCRIPTION_PLAN = require("../../controllers/38. SubscriptionPlans/1. GET_ALL")
const POST_SUBSCRIPTION_PLAN = require("../../controllers/38. SubscriptionPlans/3. POST")
const GET_SINGLE_SUBSCRIPTION_PLAN = require("../../controllers/38. SubscriptionPlans/2. GET_SINGLE")
const UPDATE_SUBSCRIPTION_PLAN = require("../../controllers/38. SubscriptionPlans/4. UPDATE")
const DELETE_SUBSCRIPTION_PLAN = require("../../controllers/38. SubscriptionPlans/5. DELETE")

const router = express.Router()

router.route("/subscription-plan")
.get(GET_ALL_SUBSCRIPTION_PLAN)
.post(POST_SUBSCRIPTION_PLAN)

router.route("/subscription-plan/:id")
.get(GET_SINGLE_SUBSCRIPTION_PLAN)
.put(UPDATE_SUBSCRIPTION_PLAN)
.delete(DELETE_SUBSCRIPTION_PLAN)

module.exports = router