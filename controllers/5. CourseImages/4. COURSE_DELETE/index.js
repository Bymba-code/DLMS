const { deleteData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService");

const COURSE_DELETE_IMAGE = async (req , res) => {
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

        const existData = await prismaService.course_images.findUnique({
            where: {
                id: parseInt(id)
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

        if(parseInt(existData.course) !== parseInt(course.id))
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Таны хандах мэдээлэл биш байна."
            })
        }

        await deleteData(`course_images`, { id: parseInt(id)}, res)


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

module.exports = COURSE_DELETE_IMAGE