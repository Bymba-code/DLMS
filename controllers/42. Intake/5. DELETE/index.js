const { deleteData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService");

const DELETE_COURSE_INTAKE = async (req , res) => {
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
        
        const data = await prismaService.course_intake.findFirst({
            where:{
                id:parseInt(id),
                course:parseInt(user?.course)
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


        await deleteData(`car_type`, { id: parseInt(id)}, res)


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

module.exports = DELETE_COURSE_INTAKE