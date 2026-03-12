const { deleteData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService");

const COURSE_DELETE_STUDENT_ACCESS = async (req , res) => {
    try 
    {
        const admin = req.user;

        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        await deleteData(`course_student_access`, { id: parseInt(id)}, res)

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

module.exports = COURSE_DELETE_STUDENT_ACCESS