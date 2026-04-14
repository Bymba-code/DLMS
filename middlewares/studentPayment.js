const prismaService = require("../services/prismaService");

const checkStudentPayment = async (req, res, next) => {
    try 
    {
        const student = req.user;

        if (!student?.id) 
        {
            return res.status(401).json({
                success: false,
                message: "Эрх байхгүй байна."
            });
        }

        const now = new Date();

        const payment = await prismaService.course_student_payment.findFirst({
            where: {
                student: parseInt(student.id),
                status: "Төлөгдсөн",
                end_date: {
                    gte: now
                }
            },
            include: {
                student_payment: true,
                course_student_payment_invoice: {
                    orderBy: { created_at: "desc" },
                    take: 1
                }
            },
            orderBy: {
                end_date: "desc"
            }
        });

        if (!payment) 
        {
            return res.status(403).json({
                success: false,
                message: "Идэвхтэй эрх байхгүй байна. Та эхлээд төлбөр төлнө үү.",
                code: "NO_ACTIVE_PAYMENT"
            });
        }

        req.studentPayment = {
            id:        payment.id,
            status:    payment.status,
            startDate: payment.start_date,
            endDate:   payment.end_date,
            plan: payment.student_payment
                ? {
                    id:    payment.student_payment.id,
                    price: payment.student_payment.price,
                }
                : null,
            lastInvoice: payment.course_student_payment_invoice?.[0] || null,
            daysRemaining: Math.ceil(
                (new Date(payment.end_date) - now) / (1000 * 60 * 60 * 24)
            ),
        };

        next();
    } 
    catch (err) 
    {
        console.error("checkStudentPayment middleware алдаа:", err);
        return res.status(500).json({
            success: false,
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = checkStudentPayment;