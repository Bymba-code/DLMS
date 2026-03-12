const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService"); 
const { default: axios } = require("axios");

const POST_COURSE_LIMIT_INVOICE = async (req , res) => {
    try 
    {
        const { course, limit } = req.body;

        if(!course)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Автосургууль сонгоно уу."
            })
        }
        if(!limit)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Бүртгэлийн тоо сонгоно уу."
            })
        }

        const price = parseInt(limit) * parseInt(process.env.PRICE)

        const responseByl = await axios.post(`https://byl.mn/api/v1/projects/${process.env.PROJECT_ID}/invoices`,
            {
                amount: price,
                description: `${ course }, НЭХЭМЖЛЭЛИЙН ТӨЛБӨР`,
                auto_advance:true
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.BYL_TOKEN}`
                }
            }
        )

        const result = await prismaService.course_limit_invoice.create({
            data: {
                course: parseInt(course),
                limit: parseInt(limit),
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

    }
}

module.exports = POST_COURSE_LIMIT_INVOICE