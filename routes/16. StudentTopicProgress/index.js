const express = require("express")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const STUDENT_POST_TOPIC_PROGRESS = require("../../controllers/16. StudentTopicProgress/3. POST")

const router = express.Router()

router.route("/student/topic-progress")
.post(authMiddlewareStudent, STUDENT_POST_TOPIC_PROGRESS)

router.route("/student/topic-progress/:id")



module.exports = router