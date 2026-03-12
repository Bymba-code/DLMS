const { storeSingleData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const STUDENT_GET_SINGLE_DRIVING_SCHEDULE = async (req, res) => {
    try {
        const student = req.user
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const where = { id: parseInt(id), student: student?.id };
       
        const include = {
                
            };

        return await storeSingleData(res, 'course_student_driving_schedule', {
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

module.exports = STUDENT_GET_SINGLE_DRIVING_SCHEDULE;