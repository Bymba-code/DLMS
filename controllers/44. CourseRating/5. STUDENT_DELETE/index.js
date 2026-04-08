const { deleteData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService") 

const STUDENT_DELETE_COURSE_RATING = async (req , res) => {
    try 
    {
        const student = req.user;

        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const data = await prismaService.course_rating.findFirst({
            where:{
                student:parseInt(student?.id),
                course: parseInt(student?.course),
                id:parseInt(id)
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

        await deleteData(`course_rating`, { id: parseInt(id)}, res)


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

module.exports = STUDENT_DELETE_COURSE_RATING