const express = require("express")
const GET_ALL_BLOODTYPE = require("../../controllers/26. BloodType/1. GET_ALL")
const GET_ALL_GENDER = require("../../controllers/27. Gender/1. GET_ALL")

const router = express.Router()

router.route("/gender")
.get(GET_ALL_GENDER)

module.exports = router