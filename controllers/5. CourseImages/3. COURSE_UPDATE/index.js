const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt");
const prismaService = require("../../../services/prismaService");

const COURSE_UPDATE_IMAGE = async (req , res) => {
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

        const existData = await prismaService.course_images.findFirst({
            where: {
                id: parseInt(id),
                course: parseInt(course?.id)
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

        let image;

        if(req.file)
        {
            image = `/${req.file.path}`
        }

    

        
        await updateData(res, {
            model:`course_images`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(image && { image: image}),
            }
        })

        
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

module.exports = COURSE_UPDATE_IMAGE