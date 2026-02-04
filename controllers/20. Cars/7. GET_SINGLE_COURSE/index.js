const { storeSingleData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const COURSE_GET_SINGLE_CARS = async (req, res) => {
    try {
        const user = req.user;
        
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const where = { id: parseInt(id), course: parseInt(user?.course) };
       
        const include = {
                
            };

        return await storeSingleData(res, 'course_cars', {
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

module.exports = COURSE_GET_SINGLE_CARS;