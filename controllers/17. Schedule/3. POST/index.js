const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const POST_SCHEDULE = async (req , res) => {
    try 
    {
        const { course, category, teacher , schedule_date, start_time, end_time, location, note } = req.body;

        if(!course)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Автосургууль сонгоно уу."
            })
        }

        if(!category)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хуваарийн ангилал сонгоно уу."
            })
        }

        if(!teacher)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хичээл орох багш сонгоно уу."
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

         if(!location)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хичээл орох анги өрөө байр оруулна уу."
            })
        }


        const existCourse = await prismaService.course.findUnique({
            where: {
                id: parseInt(course)
            }
        })

        if(!existCourse)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Автосургуулийн мэдээлэл олдсонгүй."
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

        
        
        await insertData(res, { model: 'schedule', data: { course: parseInt(course), category:parseInt(category), teacher: parseInt(teacher), schedule_date:new Date(schedule_date), start_time:new Date(start_time), end_time: new Date(end_time), location: location, note: note ? note : "", date: new Date()  }})
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

module.exports = POST_SCHEDULE