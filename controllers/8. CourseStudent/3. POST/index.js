const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService"); 
const { default: axios } = require("axios");

const POST_COURSE_STUDENT = async (req , res) => {
    try 
    {
        const {category, course, familyname, firstname, lastname, register, gender, bloodtype, city, district, location, phone, kode, password, confirmPassword, birthdate} = req.body;

        if(!category)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Ангилал сонгоно уу."
            })
        }
        if(!course)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Автосургууль сонгоно уу."
            })
        }
        if(!familyname)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Ургийн овог оруулна уу."
            })
        }
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
        if(!gender)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хүйс сонгоно уу."
            })
        }
        if(!bloodtype)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Цусны бүлэг сонгоно уу."
            })
        }
        if(!city)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хот аймаг сонгоно уу."
            })
        }
        if(!district)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Дүүрэг сонгоно уу."
            })
        }
        if(!location)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "гудамж байр тоот оруулна уу."
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

        const existCategory = await prismaService.course_category.findFirst({
            where: {
                category: parseInt(category),
                course: parseInt(course)
            }
        })

        if(!existCategory)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Сонгосон ангилалын мэдээлэл олдсонгүй."
            })
        }

        const existData = await prismaService.course_student.findFirst({
            where: {
                kode:kode,
                course:parseInt(course)
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

        const result = await prismaService.course_student.create({
            data: {
                course:parseInt(course),
                familyname:familyname,
                firstname:firstname,
                lastname:lastname,
                register:register,
                gender:parseInt(gender),
                bloodtype:parseInt(bloodtype),
                city:city,
                district:district,
                location: location,
                phone:phone,
                kode:kode,
                password:hash,
                birthdate:new Date(birthdate),
                date: new Date()
            }
        })

        const resultCategory = await prismaService.course_student_category.create({
            data: {
                student: parseInt(result?.id),
                category: parseInt(category),
                payment: parseInt(existCategory.price),
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
        console.log(err)
        return res.status(500).json({
            success:false,
            data:[],
            message: "Серверийн алдаа гарлаа."
        })
    }
}

module.exports = POST_COURSE_STUDENT