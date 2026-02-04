const express = require("express")
const GET_ALL_WARDS = require("../../controllers/30. Wards/1. GET_ALL")

const router = express.Router()

router.route("/wards")
.get(GET_ALL_WARDS)

module.exports = router