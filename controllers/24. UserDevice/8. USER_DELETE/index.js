const { deleteData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const USER_DELETE_DEVICE = async (req , res) => {
    try 
    {
        const user = req.user;

        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const data = await prismaService.course_user_device.findFirst({
            where: {
                id: parseInt(id),
                user: parseInt(user?.id)
            }
        })

        if(!data)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Мэдээлэл устсан эсвэл байхгүй байна."
            })
        }

        await deleteData(`course_user_device`, { id: parseInt(id)}, res)

    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data:[],
            message: "Серверийн алдаа гарлаа." + err
        })
    }
}

module.exports = USER_DELETE_DEVICE