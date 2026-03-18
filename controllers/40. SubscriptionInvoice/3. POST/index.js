const { insertData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");
const axios = require("axios")

const POST_COURSE_SUBSCRIPTION_INVOICE = async (req, res) => {
    try {
        const owner = req.user;

        const { course_subscription } = req.body;

        const data = await prismaService.course_subscription.findFirst({
            where:{
                id:parseInt(course_subscription)
            },
            include:{
                subscription_plan:true
            }
        })

        if(!data)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Багцийн мэдээлэл олдсонгүй."
            })
        }
        
        const responseByl = await axios.post(`https://byl.mn/api/v1/projects/${process.env.PROJECT_ID}/invoices`,
            {
                amount: parseInt(data?.subscription_plan?.salePrice ? data?.subscription_plan?.salePrice : data?.subscription_plan?.price),
                description: `БАГЦИЙН ТӨЛБӨР`,
                auto_advance:true
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.BYL_TOKEN}`
                }
            }
        )


        const result = await prismaService.course_subscription_invoice.create({
            data: {
                subscription: parseInt(course_subscription),
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
            message:"Амжилттай."
        })
        


    } catch (err) {
        console.error("POST_COURSE_OWNER алдаа:", err);
        return res.status(500).json({ success: false, data: [], message: "Серверийн алдаа гарлаа." });
    }
};

module.exports = POST_COURSE_SUBSCRIPTION_INVOICE;