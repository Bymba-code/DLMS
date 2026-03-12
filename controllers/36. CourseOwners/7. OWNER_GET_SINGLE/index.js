const { storeSingleData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const OWNER_GET_SINGLE_COURSE_OWNER = async (req, res) => {
    try {
        const owner = req.user;

        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const data = await prismaService.course_owners.findFirst({
            where:{
                id:parseInt(id),
                course:parseInt(owner?.course)
            }
        })

        if(!data)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Мэдээлэл устсан эсвэл байхгүй байна."
            })
        }

        const where = { id: parseInt(id) };
       
        const include = {};

        return await storeSingleData(res, 'course_owners', {
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

module.exports = OWNER_GET_SINGLE_COURSE_OWNER;