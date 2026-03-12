const express = require("express")
const GET_ALL_BANK = require("../../controllers/34. Bank/1. GET_ALL")
const POST_BANK = require("../../controllers/34. Bank/3. POST")
const UPDATE_BANK = require("../../controllers/34. Bank/4. UPDATE")
const GET_SINGLE_BANK = require("../../controllers/34. Bank/2. GET_SINGLE")
const DELETE_BANK = require("../../controllers/34. Bank/5. DELETE")

const router = express.Router()

router.route("/bank")
.get(GET_ALL_BANK)
.post(POST_BANK)

router.route("/bank/:id")
.put(UPDATE_BANK)
.get(GET_SINGLE_BANK)
.delete(DELETE_BANK)

module.exports = router