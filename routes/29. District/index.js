const express = require("express")
const GET_ALL_DISTRICT = require("../../controllers/29. District/1. GET_ALL")

const router = express.Router()

router.route("/district")
.get(GET_ALL_DISTRICT)

module.exports = router