const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const COURSE_POST_USER = async (req , res) => {
    try 
    {
        const course = req.user 
        const { firstname, lastname, register, phone, kode, password, confirmPassword, birthdate } = req.body;

        if(!firstname)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Овог нэр оруулна уу."
            })
        }
        if(!lastname)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Нэр оруулна уу."
            })
        }
        if(!register)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Регистерийн дугаар оруулна уу."
            })
        }
        if(!phone)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Утасны дугаар оруулна уу."
            })
        }
        if(!kode)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Нэвтрэх код оруулна уу."
            })
        }
        if(!password)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Нууц үг оруулна уу."
            })
        }
        if(!confirmPassword)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Нууц үг давтан оруулна уу."
            })
        }
        if(!birthdate)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Төрсөн огноо оруулна уу."
            })
        }

 if(password !== confirmPassword)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Нууц үг хоорондоо таарахгүй байна."
            })
        }

        const existData = await prismaService.course_users.findFirst({
            where: {
                kode:kode,
                course:parseInt(course.id)
            }
        })
        
        if(existData)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Нэвтрэх код бүртгэлтэй байна."
            })
        }

        

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const result = await prismaService.course_users.create({
            data: {
                course:parseInt(course.id),
                firstname:firstname,
                lastname:lastname,
                register:register,
                phone:phone,
                kode:kode,
                password:hash,
                birthdate:new Date(birthdate),
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

module.exports = COURSE_POST_USER