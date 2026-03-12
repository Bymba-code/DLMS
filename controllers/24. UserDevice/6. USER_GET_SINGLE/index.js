const { storeSingleData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const USER_GET_SINGLE_DEVICE = async (req, res) => {
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
        
        const existData = await prismaService.course_user_device.findUnique({
            where:{
                id: parseInt(id),
                user: parseInt(user?.id)
            }
        })

        if(!existData)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Мэдээлэл устсан эсвэл байхгүй байна."
            })
        }

        return res.status(200).json({
            success:true,
            data:existData,
            message: "Амжилттай."
        })

    } catch (err) {

        return res.status(500).json({
            success: false,
            data: null,
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = USER_GET_SINGLE_DEVICE;