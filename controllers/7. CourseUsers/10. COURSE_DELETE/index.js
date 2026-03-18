const { deleteData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const DELETE_COURSE_USER = async (req , res) => {
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

        const data = await prismaService.course_users.findFirst({
            where: {
                id: parseInt(id),
                course: course.course
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

        await deleteData(`course_users`, { id: parseInt(id)}, res)

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

module.exports = DELETE_COURSE_USER