const { storeSingleData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const GET_SINGLE_COURSE_USER = async (req, res) => {
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
                
            };

        return await storeSingleData(res, 'course_users', {
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

module.exports = GET_SINGLE_COURSE_USER;