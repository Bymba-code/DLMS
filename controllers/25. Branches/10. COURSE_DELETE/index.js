const { deleteData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const COURSE_DELETE_BRANCHES = async (req , res) => {
    try 
    {
        const course = req.user;

        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const data = await prismaService.branches.findFirst({
            where: {
                id:parseInt(id),
                course: parseInt(course?.id)
            }
        })

        if(!data)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Мэдээлэл олдсонгүй."
            })
        }

        await deleteData(`branches`, { id: parseInt(id)}, res)

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

module.exports = COURSE_DELETE_BRANCHES