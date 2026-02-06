const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const COURSE_GET_ALL_STUDENT_DETAILS = async (req, res) => {
    try 
    {
        const admin = req.user;
        
        const data = await prismaService.course_student_details.findMany({
            where: {
                course_student: {
                    course: parseInt(admin?.course)
                },
            },
            include:{
                course_student:{
                    include:{
                        course_course_student_courseTocourse:true
                    }
                }
            }
        });

        if(!data)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Мэдээлэл олдсонгүй."
            })
        }

        return res.status(200).json({
            success:true,
            data:data,
            message: "Амжилттай."
        })

    } 
    catch(err) 
    {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = COURSE_GET_ALL_STUDENT_DETAILS ;