const { storeSingleData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const TEACHER_GET_SINGLE_DRIVING_SCHEDULE = async (req, res) => {
    try {
        const teacher = req.user;

        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

       
        const existData = await prismaService.driving_schedule.findFirst({
            where: {
                id: parseInt(id),
                teacher: parseInt(teacher?.id)
            },
            include:{
                course_cars:true,
                course_student_driving_schedule_course_student_driving_schedule_driving_scheduleTodriving_schedule:{
                    include:{
                        course_student:true
                    }
                },
                course_teachers:true,
                category_driving_schedule_categoryTocategory:true
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

        return res.status(200).json({
            success:true,
            data:existData,
            message: "Амжилттай."
        })

    } catch (err) {

        return res.status(500).json({
            success: false,
            data: null,
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = TEACHER_GET_SINGLE_DRIVING_SCHEDULE;