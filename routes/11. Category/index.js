const express = require("express")
const GET_ALL_CATEGORY = require("../../controllers/11. Category/1. GET_ALL")
const GET_SINGLE_CATEGORY = require("../../controllers/11. Category/2. GET_SINGLE")
const POST_CATEGORY = require("../../controllers/11. Category/3. POST")
const UPDATE_CATEGORY = require("../../controllers/11. Category/4. UPDATE")
const DELETE_CATEGORY = require("../../controllers/11. Category/5. DELETE")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const STUDENT_GET_ALL_CATEGORY = require("../../controllers/11. Category/6. STUDENT")
const OWNER_GET_ALL_CATEGORY = require("../../controllers/11. Category/7. COURSE_GET_ALL")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")

const router = express.Router()

router.route("/category")
.get(GET_ALL_CATEGORY)
.post(POST_CATEGORY)

router.route("/category/:id")
.get(GET_SINGLE_CATEGORY)
.put(UPDATE_CATEGORY)
.delete(DELETE_CATEGORY)

router.route("/student/category")
.get(authMiddlewareStudent, STUDENT_GET_ALL_CATEGORY)

router.route("/owner/category")
.get(authMiddlewareCourse, OWNER_GET_ALL_CATEGORY)

module.exports = router