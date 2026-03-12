const express = require("express")
const GET_ALL_COURSE_OWNER = require("../../controllers/36. CourseOwners/1. GET_ALL")
const POST_COURSE_OWNER = require("../../controllers/36. CourseOwners/3. POST")
const GET_SINGLE_COURSE_OWNER = require("../../controllers/36. CourseOwners/2. GET_SINGLE")
const UPDATE_COURSE_OWNER = require("../../controllers/36. CourseOwners/4. UPDATE")
const DELETE_COURSE_OWNER = require("../../controllers/36. CourseOwners/5. DELETE")
const { upload } = require("../../services/uploadService")
const LOGIN_OWNER = require("../../controllers/36. CourseOwners/11. LOGIN")
const authMiddlewareOwner = require("../../middlewares/ownerMiddleware")
const OWNER_GET_ALL_OWNERS = require("../../controllers/36. CourseOwners/6. OWNER_GET_ALL")
const OWNER_POST_OWNER = require("../../controllers/36. CourseOwners/8. OWNER_POST")
const OWNER_UPDATE_OWNER = require("../../controllers/36. CourseOwners/9. OWNER_UPDATE")
const OWNER_GET_SINGLE_COURSE_OWNER = require("../../controllers/36. CourseOwners/7. OWNER_GET_SINGLE")
const OWNER_DELETE_COURSE_OWNER = require("../../controllers/36. CourseOwners/10. OWNER_DELETE")

const router = express.Router()

router.route("/course-owner")
.get(GET_ALL_COURSE_OWNER)
.post(POST_COURSE_OWNER)

router.route("/course-owner/:id")
.get(GET_SINGLE_COURSE_OWNER)
.put(upload.single("file"), UPDATE_COURSE_OWNER)
.delete(DELETE_COURSE_OWNER)

router.route("/owner/course-owner")
.get(authMiddlewareOwner, OWNER_GET_ALL_OWNERS)
.post(authMiddlewareOwner, OWNER_POST_OWNER)

router.route("/owner/course-owner/:id")
.get(authMiddlewareOwner, OWNER_GET_SINGLE_COURSE_OWNER)
.put(authMiddlewareOwner, upload.single(`file`), OWNER_UPDATE_OWNER)
.delete(authMiddlewareOwner, OWNER_DELETE_COURSE_OWNER)


router.route("/owner-login")
.post(LOGIN_OWNER)


module.exports = router