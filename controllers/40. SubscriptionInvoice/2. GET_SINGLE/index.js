const { storeSingleData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const COURSE_GET_SINGLE_SUBSCRIPTION_INVOICE = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const where = { id: parseInt(id) };

       
        const include = {
            course_subscription:{
                include:{
                    subscription_plan:true
                }
            }
        };

        return await storeSingleData(res, 'course_subscription_invoice', {
            where,
            include
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            data: null,
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = COURSE_GET_SINGLE_SUBSCRIPTION_INVOICE;