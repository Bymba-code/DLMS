const express = require("express")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const COURSE_GET_ALL_IMAGE = require("../../controllers/5. CourseImages/1. COURSE_GET_ALL")
const COURSE_POST_IMAGE = require("../../controllers/5. CourseImages/2. COURSE_POST")
const COURSE_UPDATE_IMAGE = require("../../controllers/5. CourseImages/3. COURSE_UPDATE")
const COURSE_DELETE_IMAGE = require("../../controllers/5. CourseImages/4. COURSE_DELETE")
const { upload } = require("../../services/uploadService")

const router = express.Router()

router.route("/course-images")
.get(authMiddlewareCourse, COURSE_GET_ALL_IMAGE)
.post(authMiddlewareCourse, upload.single(`file`), COURSE_POST_IMAGE)

router.route("/course-images/:id")
.put(authMiddlewareCourse, upload.single(`file`), COURSE_UPDATE_IMAGE)
.delete(authMiddlewareCourse, COURSE_DELETE_IMAGE)

module.exports = router