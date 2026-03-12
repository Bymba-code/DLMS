const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService"); 
const { default: axios } = require("axios");

const COURSE_POST_SYSTEM_RENTAL = async (req , res) => {
    try 
    {
        const course = req.user;

        const responseByl = await axios.post(`https://byl.mn/api/v1/projects/${process.env.PROJECT_ID}/invoices`,
            {
                amount: process.env.SYSTEM_PRICE,
                description: `СИСТЕМ АШИГЛАЛТЫН ТӨЛБӨР`,
                auto_advance:true
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.BYL_TOKEN}`
                }
            }
        )


        const date = new Date()
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);

        const result = await prismaService.course_system_rental.create({
            data: {
                course:parseInt(course?.id),
                invoice_id: responseByl?.data?.data?.id,
                start_date: date,
                end_date: endDate,
                date: new Date(),
                status: responseByl?.data?.data?.status,
                amount: responseByl?.data?.data?.amount,
                description: responseByl?.data?.data?.description,
                number: responseByl?.data?.data?.number,
                url: responseByl?.data?.data?.url,
                due_date: responseByl?.data?.data?.due_date,
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
            success:false,
            data:[],
            message: "Серверийн алдаа гарлаа."
        })
    }
}

module.exports = COURSE_POST_SYSTEM_RENTAL