const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const COURSE_POST_TEACHER = async (req , res) => {
    try 
    {
        const user = req.user 
        const { firstname, lastname, register, kode, password, confirmPassword } = req.body;

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

        const kodeExist = await prismaService.course_teachers.findFirst({
            where: {
                course: parseInt(user?.course),
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
        

        await insertData(res, { model: 'course_teachers', data: { course: parseInt(user?.course), firstname, lastname, register, kode, password: hash, date: new Date()   }})

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

module.exports = COURSE_POST_TEACHER