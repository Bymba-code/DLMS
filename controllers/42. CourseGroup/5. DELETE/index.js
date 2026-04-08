const { deleteData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const COURSE_DELETE_GROUP = async (req , res) => {
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

        const data = await prismaService.course_group.findFirst({
            where:{
                course:parseInt(user?.course),
                id:parseInt(id)
            }
        })

        await deleteData(`course_group`, { id: parseInt(id)}, res)


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

module.exports = COURSE_DELETE_GROUP