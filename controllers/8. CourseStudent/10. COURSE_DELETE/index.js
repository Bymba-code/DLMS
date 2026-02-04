const { deleteData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const COURSE_DELETE_STUDENT = async (req , res) => {
    try 
    {    
        const user = req.user;

        const course = req.user;
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const existData = await prismaService.course_student.findFirst({
      where: {
        id:parseInt(id),
        course: parseInt(user?.course)
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

        await deleteData(`course_student`, { id: parseInt(id)}, res)

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

module.exports = COURSE_DELETE_STUDENT