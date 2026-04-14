const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService"); 

const STUDENT_POST_DEDU_REQUEST = async (req , res) => {
    try 
    {
        const student = req.user;

        const {type, description} = req.body;

        if(!type)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Төрөл сонгоно уу."
            })
        }

        const studentExist = await prismaService.course_student.findFirst({
            where: {
                id: parseInt(student?.id),
            }
        })

        if(!studentExist)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Суралцагчийн мэдээлэл байхгүй эсвэл устсан байна."
            })
        }

        const result = await prismaService.course_student_dedu_request.create({
            data: {
                course:parseInt(student?.course),
                student:parseInt(student?.id),
                type:type,
                status:"Хүлээгдэж байна.",
                description:description ? description : "",
                created_at: new Date()
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

module.exports = STUDENT_POST_DEDU_REQUEST