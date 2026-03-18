const { insertData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");
const axios = require("axios")

const POST_COURSE_SUBSCRIPTION_PLAN = async (req, res) => {
    try {
        const owner = req.user;
        const { plan } = req.body;

        if (!plan)     return res.status(400).json({ success: false, data: [], message: "Багц сонгоно уу." });

        const package = await prismaService.subscription_plan.findUnique({
            where:{
                id:parseInt(plan)
            }
        })

        const courseSubscription = await prismaService.course_subscription.create({
            data:{
                course:parseInt(owner?.course),
                plan:parseInt(plan),
                status:"Төлөгдөөгүй",
                created_at: new Date()
            }
        })

        const responseByl = await axios.post(`https://byl.mn/api/v1/projects/${process.env.PROJECT_ID}/invoices`,
            {
                amount: parseInt(package?.salePrice ? package?.salePrice : package?.price),
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
                subscription: parseInt(courseSubscription?.id),
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
            data:courseSubscription,
            message: "Амжилттай."
        })


    } catch (err) {
        console.error("POST_COURSE_OWNER алдаа:", err);
        return res.status(500).json({ success: false, data: [], message: "Серверийн алдаа гарлаа." });
    }
};

module.exports = POST_COURSE_SUBSCRIPTION_PLAN;