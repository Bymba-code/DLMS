const prismaService = require("../../../services/prismaService");
const axios = require("axios");

const COURSE_UPDATE_SUBSCRIPTION_PLAN_INVOICE = async (req, res) => {
    try {
        const { id } = req.params;

        /* ── 1. Validate ── */
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "ID буруу байна."
            });
        }

        /* ── 2. Invoice татах ── */
        const invoice = await prismaService.course_subscription_invoice.findUnique({
            where: { id: parseInt(id) },
            include: {
                course_subscription: {
                    include: {
                        subscription_plan: true
                    }
                }
            }
        });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Нэхэмжлэл олдсонгүй."
            });
        }

        /* ── 3. Аль хэдийн төлөгдсөн бол шууд буцаах ── */
        if (invoice.status === "paid") {
            // Subscription-ийн бүтэн мэдээллийг буцаана
            const fullSub = await getFullSubscription(invoice.subscription);
            return res.status(200).json({
                success: true,
                data: fullSub,
                message: "Төлбөр аль хэдийн төлөгдсөн байна."
            });
        }

        /* ── 4. invoice_id шалгах ── */
        if (!invoice.invoice_id) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Byl.mn invoice ID олдсонгүй."
            });
        }

        /* ── 5. Byl.mn API шалгах ── */
        let bylResponse;
        try {
            bylResponse = await axios.get(
                `https://byl.mn/api/v1/projects/${process.env.PROJECT_ID}/invoices/${invoice.invoice_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.BYL_TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    timeout: 10000
                }
            );
        } catch (axiosErr) {
            console.error("Byl.mn API алдаа:", axiosErr?.response?.data || axiosErr.message);
            return res.status(502).json({
                success: false,
                data: null,
                message: "Төлбөрийн систем холбогдохгүй байна. Дахин оролдоно уу."
            });
        }

        const bylStatus = bylResponse?.data?.data?.status;

        /* ── 6. Төлөгдөөгүй ── */
        if (bylStatus === "open") {
            return res.status(200).json({
                success: false,
                data: null,
                message: "Төлбөр одоогоор төлөгдөөгүй байна."
            });
        }

        /* ── 7. Цуцлагдсан / хүчингүй ── */
        if (bylStatus === "void" || bylStatus === "cancelled") {
            await prismaService.course_subscription_invoice.update({
                where: { id: parseInt(id) },
                data:  { status: "void" }
            });
            return res.status(200).json({
                success: false,
                data: null,
                message: "Нэхэмжлэл цуцлагдсан байна."
            });
        }

        /* ── 8. Төлөгдсөн ── */
        if (bylStatus === "paid") {

            const now = new Date();

            // UTC+8 timezone тохируулах
            const toUTC8 = (d) => {
                const copy = new Date(d);
                copy.setHours(copy.getHours() + 8);
                return copy;
            };

            const startDate = toUTC8(now);
            const endDate   = toUTC8(now);
            endDate.setMonth(
                endDate.getMonth() + (invoice.course_subscription.subscription_plan.duration || 1)
            );

            // Invoice шинэчлэх
            await prismaService.course_subscription_invoice.update({
                where: { id: parseInt(id) },
                data: {
                    status:     "paid",
                    updated_at: bylResponse?.data?.data?.updated_at
                        ? new Date(bylResponse.data.data.updated_at)
                        : now
                }
            });

            // Subscription шинэчлэх
            await prismaService.course_subscription.update({
                where: { id: parseInt(invoice.subscription) },
                data: {
                    status:     "Төлөгдсөн",
                    start_date: startDate,
                    end_date:   endDate,
                    updated_at: now
                }
            });

            // Бүтэн мэдээллийг буцаах
            const fullSub = await getFullSubscription(invoice.subscription);

            return res.status(200).json({
                success: true,
                data:    fullSub,
                message: "Төлбөр амжилттай баталгаажлаа."
            });
        }

        /* ── 9. Тодорхойгүй статус ── */
        return res.status(200).json({
            success: false,
            data: null,
            message: `Тодорхойгүй статус: ${bylStatus}`
        });

    } catch (err) {
        console.error("INVOICE UPDATE ERROR:", err);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа гарлаа: " + err.message
        });
    }
};

/* ── helper: subscription-ийг бүтнээр нь буцаана ── */
async function getFullSubscription(subscriptionId) {
    return prismaService.course_subscription.findUnique({
        where: { id: parseInt(subscriptionId) },
        include: {
            subscription_plan: true,
            course_subscription_invoice: true
        }
    });
}

module.exports = COURSE_UPDATE_SUBSCRIPTION_PLAN_INVOICE;