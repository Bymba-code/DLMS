const express = require("express")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const STUDENT_GET_ALL_DEDU_REQUEST = require("../../controllers/47. StudentDeduRequest/4. STUDENT_GET_ALL")
const STUDENT_POST_DEDU_REQUEST = require("../../controllers/47. StudentDeduRequest/6. STUDENT_POST")
const STUDENT_GET_SINGLE_DEDU_REQUEST = require("../../controllers/47. StudentDeduRequest/5. STUDENT_GET_SINGLE")
const STUDENT_UPDATE_DEDU_REQUEST = require("../../controllers/47. StudentDeduRequest/7. STUDENT_UPDATE")
const STUDENT_DELETE_DEDU_REQUEST = require("../../controllers/47. StudentDeduRequest/8. STUDENT_DELETE")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const COURSE_GET_ALL_STUDENT_DEDU_REQUEST = require("../../controllers/47. StudentDeduRequest/1. COURSE_GET_ALL")
const COURSE_GET_SINGLE_STUDENT_DEDU_REQUEST = require("../../controllers/47. StudentDeduRequest/2. COURSE_GET_SINGLE")
const COURSE_UPDATE_STUDENT_DEDU_REQUEST = require("../../controllers/47. StudentDeduRequest/3. COURSE_UPDATE")

const router = express.Router()

router.route("/student-dedu-request")
.get(authMiddlewareStudent, STUDENT_GET_ALL_DEDU_REQUEST)
.post(authMiddlewareStudent, STUDENT_POST_DEDU_REQUEST)

router.route("/student-dedu-request/:id")
.get(authMiddlewareStudent, STUDENT_GET_SINGLE_DEDU_REQUEST)
.put(authMiddlewareStudent, STUDENT_UPDATE_DEDU_REQUEST)
.delete(authMiddlewareStudent, STUDENT_DELETE_DEDU_REQUEST)

router.route("/admin/dedu-request")
.get(authMiddlewareUser, COURSE_GET_ALL_STUDENT_DEDU_REQUEST)

router.route("/admin/dedu-request/:id")
.get(authMiddlewareUser, COURSE_GET_SINGLE_STUDENT_DEDU_REQUEST)
.put(authMiddlewareUser, COURSE_UPDATE_STUDENT_DEDU_REQUEST)

module.exports = router