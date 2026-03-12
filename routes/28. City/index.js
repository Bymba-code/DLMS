const express = require("express")
const GET_ALL_GENDER = require("../../controllers/27. Gender/1. GET_ALL")
const GET_ALL_CITY = require("../../controllers/28. City/1. GET_ALL")

const router = express.Router()

router.route("/cities")
.get(GET_ALL_CITY)

module.exports = router