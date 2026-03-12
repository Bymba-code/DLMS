const express = require("express")

const router = express.Router()

router.route("/owner")

router.route("/owner/:id")

module.exports = router