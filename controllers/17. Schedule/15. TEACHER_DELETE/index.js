const { deleteData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const TEACHER_DELETE_SCHEDULE = async (req , res) => {
    try 
    {
        const teacher = req.user;
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const data = await prismaService.schedule.findFirst({
            where: {
                id: parseInt(id),
                teacher: teacher?.id
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

        await deleteData(`schedule`, { id: parseInt(id)}, res)

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

module.exports = TEACHER_DELETE_SCHEDULE