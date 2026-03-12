const { insertData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService"); 

const POST_CARS = async (req , res) => {
    try 
    {
        const { course, vechile, region_number, type } = req.body;

        if(!course)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Автосургууль сонгоно уу."
            })
        }
        if(!vechile)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Автомашины нэршил оруулна уу."
            })
        }
        if(!region_number)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Улсын дугаар оруулна уу."
            })
        }
        if(!req.file)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Автомашины зураг оруулна уу."
            })
        }
        if(!type)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Төрөл сонгоно уу."
            })
        }

        const imageUrl = `/${req.file.path}`
        
        const courseExist = await prismaService.course.findUnique({
            where: {
                id: parseInt(course)
            }
        })

        if(!courseExist)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Сонгосон автосургуулийн мэдээлэл олдсонгүй."
            })
        }

        const result = await prismaService.course_cars.create({
            data: {
                course: parseInt(course),
                vechile:vechile,
                region_number:region_number,
                image:imageUrl,
                type: parseInt(type),
                date: new Date()
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
        return res.status(500).json({
            success:false,
            data:[],
            message: "Серверийн алдаа гарлаа."
        })
    }
}

module.exports = POST_CARS