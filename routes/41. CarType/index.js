const express = require("express")
const GET_ALL_CAR_TYPE = require("../../controllers/41. CarType/1. GET_ALL")
const POST_CAR_TYPE = require("../../controllers/41. CarType/3. POST")
const GET_SINGLE_CAR_TYPE = require("../../controllers/41. CarType/2. GET_SINGLE")
const UPDATE_CAR_TYPE = require("../../controllers/41. CarType/4. UPDATE")
const DELETE_CAR_TYPE = require("../../controllers/41. CarType/5. DELETE")

const router = express.Router()

router.route("/car-type")
.get(GET_ALL_CAR_TYPE)
.post(POST_CAR_TYPE)

router.route("/car-type/:id")
.get(GET_SINGLE_CAR_TYPE)
.put(UPDATE_CAR_TYPE)
.delete(DELETE_CAR_TYPE)

module.exports = router