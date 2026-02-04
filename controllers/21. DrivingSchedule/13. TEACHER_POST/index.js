const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const TEACHER_POST_DRIVING_SCHEDULE = async (req , res) => {
    try 
    {
        const teacher = req.user 

        const { category, car, area, schedule_date, start_time, end_time, note } = req.body;

        if(!category)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хуваарийн ангилал сонгоно уу."
            })
        }
        if(!car)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Автомашин сонгоно уу."
            })
        }
        if(!area)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хичээл эхлэх газар оруулна уу."
            })
        }
        if(!schedule_date)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хичээл эхлэх өдөр оруулна уу."
            })
        }
        if(!start_time)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Эхлэх цаг оруулна уу."
            })
        }
        if(!end_time)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Дуусах цаг оруулна уу. "
            })
        }

        const existCategory = await prismaService.category.findUnique({
            where: {
                id: parseInt(category)
            }
        })

        if(!existCategory)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Ангилалийн мэдээлэл олдсонгүй."
            })
        }

        const existCar = await prismaService.course_cars.findUnique({
            where:{
                id: parseInt(car)
            }
        })

        if(!existCar)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Автомашины мэдээлэл олдсонгүй."
            })
        }

        await insertData(res, { model: 'driving_schedule', data: { course: parseInt(teacher?.course), category:parseInt(category), teacher: parseInt(teacher?.id), car:parseInt(car), area, schedule_date:new Date(schedule_date), start_time:new Date(start_time), end_time: new Date(end_time),  note: note ? note : "", add_date: new Date()  }})

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

module.exports = TEACHER_POST_DRIVING_SCHEDULE