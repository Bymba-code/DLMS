const express = require("express")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const GET_ALL_TOPIC = require("../../controllers/12. Topic/1. GET_ALL")
const GET_SINGLE_TOPIC = require("../../controllers/12. Topic/2. GET_SINGLE")
const POST_TOPIC = require("../../controllers/12. Topic/3. POST")
const UPDATE_TOPIC = require("../../controllers/12. Topic/4. UPDATE")
const DELETE_TOPIC = require("../../controllers/12. Topic/5. DELETE")
const STUDENT_GET_ALL_TOPIC = require("../../controllers/12. Topic/6. STUDENT")
const STUDENT_TOPIC_TEST = require("../../controllers/12. Topic/7. STUDENT_TOPIC_RANDOM")

const router = express.Router()

router.route("/topic")
.get(GET_ALL_TOPIC)
.post(POST_TOPIC)

router.route("/topic/:id")
.get(GET_SINGLE_TOPIC)
.put(UPDATE_TOPIC)
.delete(DELETE_TOPIC)

router.route("/student/topic")
.get(authMiddlewareStudent, STUDENT_GET_ALL_TOPIC)
.post(authMiddlewareStudent, STUDENT_TOPIC_TEST)


module.exports = router