const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");
const axios = require("axios")

const STUDENT_POST_CATEGORY_INVOICE = async (req, res) => {
    try 
    {
        const user = req.user;

        const course = await prismaService.course.findUnique({
            where:{
                id:parseInt(user?.course)
            }
        })

        const { course_student_category, amount } = req.body;

        if(!course_student_category)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Ангилалийн мэдээлэл оруулна уу."
            })
        }
        if(!amount)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Төлөх дүн оруулна уу."
            })
        }

        const responseByl = await axios.post(`https://byl.mn/api/v1/projects/${process.env.PROJECT_ID}/invoices`,
                    {
                        amount: parseInt(amount),
                        description: `${course.name}`,
                        auto_advance:true
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.BYL_TOKEN}`
                        }
                    }
        )

        const result = await prismaService.course_student_category_payments.create({
            data: {
                course_student_category:parseInt(course_student_category),
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
        

    } 
    catch(err) 
    {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = STUDENT_POST_CATEGORY_INVOICE ;