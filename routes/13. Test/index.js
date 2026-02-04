const express = require("express")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const GET_ALL_TEST = require("../../controllers/13. Test/1. GET_ALL")
const GET_SINGLE_TEST = require("../../controllers/13. Test/2. GET_SINGLE")
const POST_TEST = require("../../controllers/13. Test/3. POST")
const { upload } = require("../../services/uploadService")
const UPDATE_TEST = require("../../controllers/13. Test/4. UPDATE")
const DELETE_TEST = require("../../controllers/13. Test/5. DELETE")

const router = express.Router()

router.route("/test")
.get(GET_ALL_TEST)
.post(upload.single(`file`), POST_TEST)

router.route("/test/:id")
.get(GET_SINGLE_TEST)
.put(upload.single(`file`), UPDATE_TEST)
.delete(DELETE_TEST)

module.exports = router