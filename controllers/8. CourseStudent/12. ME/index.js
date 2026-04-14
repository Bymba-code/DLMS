const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const ME_STUDENT = async (req, res) => {
    try 
    {
        const student = req.user;

        const data = await prismaService.course_student.findUnique({
            where: {
                id: parseInt(student?.id)
            },
            include:{
                course_course_student_courseTocourse:true,
                city_course_student_cityTocity:true,
                district_course_student_districtTodistrict:true,
                wards:true
            }
        })

        const studentDetail = await prismaService.course_student_details.findFirst({
            where:{
                student:parseInt(student?.id)
            }
        })

        if(!data)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Мэдээлэл устсан эсвэл байхгүй байна."
            })
        }

        const messageCount = await prismaService.messages.count({
            where: {
                isRead:0,
                student: parseInt(student?.id)
            }
        })

        const userRating = await prismaService.course_rating.findFirst({
            where:{
                student:parseInt(student?.id),
                course:parseInt(student?.course)
            }
        })

        // Төлбөр шалгах
        const now = new Date();
        const activePayment = await prismaService.course_student_payment.findFirst({
            where: {
                student: parseInt(student?.id),
                status: "Төлөгдсөн",
                end_date: {
                    gte: now
                }
            },
            orderBy: {
                end_date: "desc"
            }
        })

        // 14 хоног өнгөрсөн эсэхийг шалгах
        const registeredDate = new Date(data.date);
        const diffInDays = Math.floor((now - registeredDate) / (1000 * 60 * 60 * 24));
        const isOver14Days = diffInDays >= 14;

        // 14 хоног болж, rating өгөөгүй бол заавал өгүүлэх
        const ratingRequired = isOver14Days && !userRating;

        return res.status(200).json({
            success:true,
            data:{
                data,
                messageCount,
                detail: studentDetail ? true : false,
                userRating: userRating ? true : false,
                ratingRequired,
                payment: activePayment ? true : false
            },
            message:"Амжилттай."
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

module.exports = ME_STUDENT;