const express = require("express")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const authMiddlewareTeacher = require("../../middlewares/teacherCookieAuth")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const GET_ALL_USER_DEVICE = require("../../controllers/24. UserDevice/1. GET_ALL")
const GET_SINGLE_USER_DEVICE = require("../../controllers/24. UserDevice/2. GET_SINGLE")
const UPDATE_USER_DEVICE = require("../../controllers/24. UserDevice/3. UPDATE")
const DELETE_USER_DEVICE = require("../../controllers/24. UserDevice/4. DELETE")
const USER_GET_ALL_DEVICE = require("../../controllers/24. UserDevice/5. USER_GET_ALL")
const USER_GET_SINGLE_DEVICE = require("../../controllers/24. UserDevice/6. USER_GET_SINGLE")
const USER_UPDATE_DEVICE = require("../../controllers/24. UserDevice/7. USER_UPDATE")
const USER_DELETE_DEVICE = require("../../controllers/24. UserDevice/8. USER_DELETE")

const router = express.Router()

router.route("/user-device")
.get(GET_ALL_USER_DEVICE)

router.route("/user-device/:id")
.get(GET_SINGLE_USER_DEVICE)
.put(UPDATE_USER_DEVICE)
.delete(DELETE_USER_DEVICE)

router.route("/user/user-device")
.get(authMiddlewareUser, USER_GET_ALL_DEVICE)

router.route("/user/user-device/:id")
.get(authMiddlewareUser, USER_GET_SINGLE_DEVICE)
.put(authMiddlewareUser, USER_UPDATE_DEVICE)
.delete(authMiddlewareUser, USER_DELETE_DEVICE)

module.exports = router