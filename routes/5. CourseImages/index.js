const express = require("express")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const COURSE_GET_ALL_IMAGE = require("../../controllers/5. CourseImages/1. COURSE_GET_ALL")
const COURSE_POST_IMAGE = require("../../controllers/5. CourseImages/2. COURSE_POST")
const COURSE_UPDATE_IMAGE = require("../../controllers/5. CourseImages/3. COURSE_UPDATE")
const COURSE_DELETE_IMAGE = require("../../controllers/5. CourseImages/4. COURSE_DELETE")
const { upload } = require("../../services/uploadService")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")

const router = express.Router()

router.route("/course-images")
.get(authMiddlewareUser, COURSE_GET_ALL_IMAGE)
.post(authMiddlewareUser, upload.single(`file`), COURSE_POST_IMAGE)

router.route("/course-images/:id")
.put(authMiddlewareUser, upload.single(`file`), COURSE_UPDATE_IMAGE)
.delete(authMiddlewareUser, COURSE_DELETE_IMAGE)

module.exports = router