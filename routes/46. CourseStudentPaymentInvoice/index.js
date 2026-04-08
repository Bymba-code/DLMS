const express = require("express")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const STUDENT_UPDATE_PAYMENT_INVOICE = require("../../controllers/46. CourseStudentPaymentInvoice/4. UPDATE")

const router = express.Router()

router.route("/course-student-payment-invoice")

router.route("/course-student-payment-invoice/:id")
.put(authMiddlewareStudent, STUDENT_UPDATE_PAYMENT_INVOICE)

module.exports = router