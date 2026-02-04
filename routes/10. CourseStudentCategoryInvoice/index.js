const express = require("express")
const STUDENT_POST_CATEGORY_INVOICE = require("../../controllers/10. CourseStudentCategoryInvoice/3. POST_STUDENT")
const authMiddlewareStudent = require("../../middlewares/studentCookieAuth")
const STUDENT_UPDATE_CATEGORY_INVOICE = require("../../controllers/10. CourseStudentCategoryInvoice/4. STUDENT_UPDATE")
const STUDENT_GET_SINGLE_CATEGORY_INVOICE = require("../../controllers/10. CourseStudentCategoryInvoice/2. GET_SINGLE_STUDENT")

const router = express.Router()

router.route("/student/course-student-category-invoice")
.post(authMiddlewareStudent, STUDENT_POST_CATEGORY_INVOICE)

router.route("/student/course-student-category-invoice/:id")
.put(authMiddlewareStudent, STUDENT_UPDATE_CATEGORY_INVOICE)
.get(authMiddlewareStudent, STUDENT_GET_SINGLE_CATEGORY_INVOICE)

router.route("/autoschool/course-student")

router.route("/autoschool/course-student/:id")

module.exports = router