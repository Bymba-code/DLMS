const express = require("express")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const authMiddlewareTeacher = require("../../middlewares/teacherCookieAuth")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const GET_ALL_BRANCHES = require("../../controllers/25. Branches/1. GET_ALL")
const GET_SINGLE_BRANCHES = require("../../controllers/25. Branches/2. GET_SINGLE")
const POST_BRANCHES = require("../../controllers/25. Branches/3. POST")
const UPDATE_BRANCHES = require("../../controllers/25. Branches/4. UPDATE")
const DELETE_BRANCHES = require("../../controllers/25. Branches/5. DELETE")
const COURSE_GET_ALL_BRANCHES = require("../../controllers/25. Branches/6. GET_ALL_COURSE")
const COURSE_GET_SINGLE_BRANCHES = require("../../controllers/25. Branches/7. GET_SINGLE_COURSE")
const COURSE_POST_BRANCHES = require("../../controllers/25. Branches/8. COURSE_POST")
const COURSE_UPDATE_BRANCHES = require("../../controllers/25. Branches/9. COURSE_UPDATE")
const COURSE_DELETE_BRANCHES = require("../../controllers/25. Branches/10. COURSE_DELETE")
const ADMIN_GET_ALL_BRANCHES = require("../../controllers/25. Branches/11. ADMIN.GET.ALL")

const router = express.Router()

router.route("/branches")
.get(GET_ALL_BRANCHES)
.post(POST_BRANCHES)

router.route("/branches/:id")
.get(GET_SINGLE_BRANCHES)
.put(UPDATE_BRANCHES)
.delete(DELETE_BRANCHES)

router.route("/owner/branches")
.get(authMiddlewareCourse, COURSE_GET_ALL_BRANCHES)
.post(authMiddlewareCourse, COURSE_POST_BRANCHES)

router.route("/owner/branches/:id")
.get(authMiddlewareCourse, COURSE_GET_SINGLE_BRANCHES)
.put(authMiddlewareCourse, COURSE_UPDATE_BRANCHES)
.delete(authMiddlewareCourse, COURSE_DELETE_BRANCHES)

router.route("/admin/branches")
.get(authMiddlewareUser, ADMIN_GET_ALL_BRANCHES)

module.exports = router