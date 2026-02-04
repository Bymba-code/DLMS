const express = require("express")
const GET_ALL_BLOODTYPE = require("../../controllers/26. BloodType/1. GET_ALL")

const router = express.Router()

router.route("/bloodtype")
.get(GET_ALL_BLOODTYPE)

module.exports = router