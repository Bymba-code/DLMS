const express = require("express")
const GET_ALL_ONLINE_REGISTER = require("../../controllers/32. OnlineRegister/1. GET_ALL")
const GET_SINGLE_ONLINE_REGISTER = require("../../controllers/32. OnlineRegister/2. GET_SINGLE")
const POST_ONLINE_REGISTER = require("../../controllers/32. OnlineRegister/3. POST")

const router = express.Router()

router.route("/online-register")
.get(GET_ALL_ONLINE_REGISTER)
.post(POST_ONLINE_REGISTER)

router.route("/online-register/:id")
.get(GET_SINGLE_ONLINE_REGISTER)

module.exports = router