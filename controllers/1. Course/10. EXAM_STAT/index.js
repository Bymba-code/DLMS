const prismaService = require("../../../services/prismaService");

const GET_EXAM_STAT = async (req, res) => {
    try {
        const user = req.user;

        const data = await prismaService.course_student.findMany({
            where:{
                course:parseInt(user?.course)
            },
            include:{
                exam:true,
                course_student_schedule:{
                    include:{
                        schedule_course_student_schedule_scheduleToschedule:true
                    }
                },
                course_student_driving_schedule:{
                    include:{
                        driving_schedule_course_student_driving_schedule_driving_scheduleTodriving_schedule:true
                    }
                }
            }
        })

        return res.status(200).json({
            data
        })
        

    } catch (err) {

        return res.status(500).json({
            success: false,
            data: null,
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = GET_EXAM_STAT;