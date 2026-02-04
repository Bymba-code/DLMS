const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService")

const UPDATE_SCHEDULE = async (req , res) => {
    try 
    {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const { course, category, teacher , schedule_date, start_time, end_time, location, note } = req.body;

        if(course)
        {
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
        }

        if(category)
        {
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
        }

        await updateData(res, {
            model:`schedule`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(course && { course }),
                ...(category && { category }),
                ...(teacher && { teacher }),
                ...(schedule_date && { schedule_date: new Date(schedule_date) }),
                ...(start_time && { start_time: new Date(start_time) }),
                ...(end_time && { end_time: new Date(end_time) }),
                ...(location && { location }),
                ...(note && { note }),
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

module.exports = UPDATE_SCHEDULE