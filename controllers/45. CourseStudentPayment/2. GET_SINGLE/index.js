const prismaService = require("../../../services/prismaService");

const STUDENT_GET_SINGLE_PAYMENT = async (req, res) => {
    try {
        const student = req.user;
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const data = await prismaService.course_student_payment.findFirst({
            where: {
                id: parseInt(id),
                student: parseInt(student.id) 
            },
            include: {
                course_student_payment_invoice: {
                    orderBy: { created_at: 'desc' },
                    take: 1
                },
                student_payment: true,
                course_student: true
            }
        });

        if (!data) {
            return res.status(404).json({
                success: false,
                data: null,
                message: 'Мэдээлэл олдсонгүй.'
            });
        }

        return res.status(200).json({
            success: true,
            data,
            message: 'Амжилттай.'
        });

    } catch (err) {
        console.error("STUDENT_GET_SINGLE_PAYMENT ERROR:", err);
        return res.status(500).json({
            success: false,
            data: null,
            message: 'Серверийн алдаа гарлаа: ' + err.message
        });
    }
};

module.exports = STUDENT_GET_SINGLE_PAYMENT;