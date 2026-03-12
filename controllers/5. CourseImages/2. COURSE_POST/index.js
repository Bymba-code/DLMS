const { insertData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService") 

const COURSE_POST_IMAGE = async (req , res) => {
    try 
    {
        const course = req.user

        if(!req.file)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Зураг оруулна уу."
            })
        }

        const imageUrl = `/${req.file.path}`

        const result = await prismaService.course_images.create({
            data:{
                course: parseInt(course && course.id ? parseInt(course.id) : ""),
                image:imageUrl
            }
        })

        return res.status(200).json({
            success:true,
            data:result,
            message: "Амжилттай."
        })

    }
    catch(err)
    {

    }
}

module.exports = COURSE_POST_IMAGE