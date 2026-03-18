const prismaService = require("../services/prismaService");

const checkSubscription = async (req, res, next) => {
    try 
    {
        const user = req.user;

        if (!user?.course) 
        {
            return res.status(401).json({
                success: false,
                message: "Эрх байхгүй байна."
            });
        }

        const now = new Date();

        const subscription = await prismaService.course_subscription.findFirst({
            where: {
                course: parseInt(user.course),
                status: "Төлөгдсөн",
                end_date: {
                    gte: now  
                }
            },
            include: {
                subscription_plan: true,           
                course_subscription_invoice: {      
                    where:   { status: "paid" },
                    orderBy: { created_at: "desc" },
                    take:    1,
                }
            },
            orderBy: {
                end_date: "desc"  // хамгийн хожуу дуусах subscription-ийг авна
            }
        });

        if (!subscription) 
        {
            return res.status(403).json({
                success:  false,
                message:  "Идэвхтэй багц байхгүй байна. Та эхлээд багц авна уу.",
                code:     "NO_ACTIVE_SUBSCRIPTION"
            });
        }

        req.subscription = {
            id:        subscription.id,
            status:    subscription.status,
            startDate: subscription.start_date,
            endDate:   subscription.end_date,
            plan: subscription.subscription_plan
                ? {
                    id:          subscription.subscription_plan.id,
                    name:        subscription.subscription_plan.name,
                    description: subscription.subscription_plan.description,
                    price:       subscription.subscription_plan.price,
                    duration:    subscription.subscription_plan.duration,
                    feature:     subscription.subscription_plan.feature,
                }
                : null,
            lastPaidInvoice: subscription.course_subscription_invoice?.[0] || null,
            // Хэдэн хоног үлдсэнийг тооцоолно
            daysRemaining: Math.ceil(
                (new Date(subscription.end_date) - now) / (1000 * 60 * 60 * 24)
            ),
        };

        next();
    } 
    catch (err) 
    {
        console.error("checkSubscription middleware алдаа:", err);
        return res.status(500).json({
            success: false,
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = checkSubscription;