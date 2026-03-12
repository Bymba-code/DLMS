const express = require("express")
const authMiddlewareCourse = require("../../middlewares/authMiddlewareCourse")
const GET_ALL_CARS = require("../../controllers/20. Cars/1. GET_ALL")
const GET_SINGLE_CARS = require("../../controllers/20. Cars/2. GET_SINGLE")
const { upload } = require("../../services/uploadService")
const POST_CARS = require("../../controllers/20. Cars/3. POST")
const UPDATE_CARS = require("../../controllers/20. Cars/4. UPDATE")
const DELETE_CARS = require("../../controllers/20. Cars/5. DELETE")
const COURSE_GET_ALL_CARS = require("../../controllers/20. Cars/6. GET_ALL_COURSE")
const COURSE_GET_SINGLE_CARS = require("../../controllers/20. Cars/7. GET_SINGLE_COURSE")
const COURSE_POST_CARS = require("../../controllers/20. Cars/8. COURSE_POST")
const COURSE_UPDATE_CARS = require("../../controllers/20. Cars/9. COURSE_UPDATE")
const COURSE_DELETE_CARS = require("../../controllers/20. Cars/10. COURSE_DELETE")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")

const router = express.Router()

router.route("/cars")
.get(GET_ALL_CARS)
.post(upload.single(`file`), POST_CARS)

router.route("/cars/:id")
.get(GET_SINGLE_CARS)
.put(upload.single(`file`), UPDATE_CARS)
.delete(DELETE_CARS)

router.route("/autoschool/cars")
.get(authMiddlewareUser, COURSE_GET_ALL_CARS)
.post(upload.single(`file`), authMiddlewareUser, COURSE_POST_CARS)

router.route("/autoschool/cars/:id")
.get(authMiddlewareUser, COURSE_GET_SINGLE_CARS)
.put(upload.single(`file`), authMiddlewareUser, COURSE_UPDATE_CARS)
.delete(authMiddlewareUser, COURSE_DELETE_CARS)

module.exports = router