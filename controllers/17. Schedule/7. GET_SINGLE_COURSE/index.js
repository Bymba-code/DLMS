const { storeSingleData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const COURSE_GET_SINGLE_SCHEDULE = async (req, res) => {
    try {
        const user = req.user;

        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

       
        const existData = await prismaService.schedule.findFirst({
            where: {
                id: parseInt(id),
                course: parseInt(user?.course)
            },
            include:{
                course_teachers:true,
                category_schedule_categoryTocategory:true,
                course_student_schedule_course_student_schedule_scheduleToschedule:{
                    include:{
                        course_student:true
                    }
                },
                
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

module.exports = COURSE_GET_SINGLE_SCHEDULE;