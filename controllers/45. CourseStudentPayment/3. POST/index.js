const { insertData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");
const axios = require("axios")

const STUDENT_POST_PAYMENT = async (req, res) => {
    try {
        const student = req.user;

        const paymentData = await prismaService.student_payment.findUnique({
            where: {
                id:parseInt(1)
            }
        })

        if(!paymentData)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Төлбөрийн мэдээлэл олдсонгүй."
            })
        }
        
        const studentPayment = await prismaService.course_student_payment.create({
            data:{
                student:parseInt(student?.id),
                payment:parseInt(1),
                status:"Төлөгдөөгүй",
                created_at: new Date()
            }
        })

        const responseByl = await axios.post(`https://byl.mn/api/v1/projects/${process.env.PROJECT_ID}/invoices`,
            {
                amount: parseInt(paymentData?.price),
                description: `ЭРХ НЭЭХ ТӨЛБӨР`,
                auto_advance:true
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.BYL_TOKEN}`
                }
            }
        )

        const result = await prismaService.course_student_payment_invoice.create({
            data: {
                student_payment: parseInt(studentPayment?.id),
                invoice_id: parseInt(responseByl?.data?.data?.id),
                status: responseByl?.data?.data?.status,
                amount: responseByl?.data?.data?.amount,
                description: responseByl?.data?.data.description,
                number: responseByl?.data?.data?.number,
                url: responseByl?.data?.data?.url,
                due_date:responseByl?.data?.data?.due_date,
                created_at: responseByl?.data?.data?.created_at,
                updated_at: responseByl?.data?.data?.updated_at
            }
        })
        
        return res.status(200).json({
            success:true,
            data:result,
            message: "Амжилттай."
        })


    } catch (err) {
        console.error("POST_COURSE_OWNER алдаа:", err);
        return res.status(500).json({ success: false, data: [], message: "Серверийн алдаа гарлаа." });
    }
};

module.exports = STUDENT_POST_PAYMENT;