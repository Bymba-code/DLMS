const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const POST_TEACHER = async (req , res) => {
    try 
    {
        const { course, firstname, lastname, register, kode, password, confirmPassword } = req.body;

        if(!course)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Автосургууль сонгоно уу."
            })
        }

        if(!firstname)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Овог нэр оруулна уу."
            })
        }

        if(!lastname)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Багшийн нэр оруулна уу."
            })
        }

         if(!register)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Регистерийн дугаар оруулна уу."
            })
        }

         if(!kode)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Нэвтрэх код оруулна уу."
            })
        }

         if(!password)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Нууц үг оруулна уу. "
            })
        }

        if(!confirmPassword)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Нууц үг давтан оруулна уу."
            })
        }


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

        const kodeExist = await prismaService.course_teachers.findFirst({
            where: {
                course: parseInt(course),
                kode:kode
            }
        })

        if(kodeExist)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Нэвтрэх код бүртгэгдсэн байна."
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
        
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        
        await insertData(res, { model: 'course_teachers', data: { course: parseInt(course), firstname, lastname, register, kode, password: hash, date: new Date()   }})    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data:[],
            message: "Серверийн алдаа гарлаа."
        })
    }
}

module.exports = POST_TEACHER