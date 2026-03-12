const { insertData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService"); 

const COURSE_POST_STUDENT_ACCESS = async (req , res) => {
    try 
    {
        const admin = req.user;

        const {student, start_date, end_date} = req.body;
    
        if(!student)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Суралцагч сонгоно уу."
            })
        }
        if(!start_date)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Эхлэх хугацаа оруулна уу."
            })
        }
        if(!end_date)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message:"Дуусах хугацаа оруулна уу."
            })
        }

        const result = await prismaService.course_student_access.create({
            data: {
                student:parseInt(student),
                start_date: new Date(start_date),
                end_date: new Date(end_date)
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
        console.log(err)
        return res.status(500).json({
            success:false,
            data:[],
            message: "Серверийн алдаа гарлаа."
        })
    }
}

module.exports = COURSE_POST_STUDENT_ACCESS