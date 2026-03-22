const express = require("express")
const authMiddlewareUser = require("../../middlewares/userCookieAuth")
const GET_REGISTER_REPORT = require("../../controllers/43. Reports/1. RegisterReport")
const GET_REGISTER_REPORT_EXCEL = require("../../controllers/43. Reports/2. RegisterReportDownload")

const router = express.Router()

router.route("/course-register-report")
.get(authMiddlewareUser, GET_REGISTER_REPORT)

router.route("/course-register-report-download")
.get(authMiddlewareUser, GET_REGISTER_REPORT_EXCEL)

router.route("/course-intake/:id")

module.exports = router