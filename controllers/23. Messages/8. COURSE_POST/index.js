const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const COURSE_POST_MESSAGE = async (req , res) => {
    try 
    {
        const user = req.user 

        const { student, title, message } = req.body;

        if(!student)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Хүлээж авах суралцагч сонгоно уу."
            })
        }
        if(!title)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Гарчиг оруулна уу."
            })
        }
        if(!message)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Илгээх зурвас оруулна уу."
            })
        }
        
        const result = await prismaService.messages.create({
            data: {
                course:parseInt(user?.course),
                student:parseInt(student),
                title:title,
                message:message,
                isRead:0,
                date: new Date()
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
        return res.status(500).json({
            success:false,
            data:[],
            message: "Серверийн алдаа гарлаа."
        })
    }
}

module.exports = COURSE_POST_MESSAGE