const { insertData } = require("../../../services/controllerService")

const POST_SUBSCRIPTION_PLAN = async (req, res) => {
    try {
        const { name, description, price, duration, active} = req.body;

        if (!name)     return res.status(400).json({ success: false, data: [], message: "Нэр оруулна уу." });
        if (!description)  return res.status(400).json({ success: false, data: [], message: "Тайлбар оруулна уу." });
        if (!price)   return res.status(400).json({ success: false, data: [], message: "Үнийн дүн оруулна уу." });
        if (!duration)      return res.status(400).json({ success: false, data: [], message: "Хугацаа оруулна уу. / Сараар /" });

        await insertData(res, {
            model: 'subscription_plan',
            data: {
                name,
                description,
                price:parseInt(price),
                duration: parseInt(duration),
                active: active ? 1 : 0,
                created_at: new Date(),
            }
        });

    } catch (err) {
        console.error("POST_COURSE_OWNER алдаа:", err);
        return res.status(500).json({ success: false, data: [], message: "Серверийн алдаа гарлаа." });
    }
};

module.exports = POST_SUBSCRIPTION_PLAN;