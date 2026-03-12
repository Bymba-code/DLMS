const express = require("express")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const GET_ALL_TEST_ANSWER = require("../../controllers/14. TestAnswers/1. GET_ALL")
const GET_SINGLE_TEST_ANSWER = require("../../controllers/14. TestAnswers/2. GET_SINGLE")
const POST_TEST_ANSWERS = require("../../controllers/14. TestAnswers/3. POST")
const UPDATE_TEST_ANSWERS = require("../../controllers/14. TestAnswers/4. UPDATE")
const DELETE_TEST_ANSWERS = require("../../controllers/14. TestAnswers/5. DELETE")

const router = express.Router()

router.route("/test-answers")
.get(GET_ALL_TEST_ANSWER)
.post(POST_TEST_ANSWERS)

router.route("/test-answers/:id")
.get(GET_SINGLE_TEST_ANSWER)
.put(UPDATE_TEST_ANSWERS)
.delete(DELETE_TEST_ANSWERS)

module.exports = router