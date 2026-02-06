const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService"); 
const { default: axios } = require("axios");

const COURSE_POST_STUDENT_DETAILS = async (req , res) => {
    try 
    {
        const admin = req.user;

        const {student, citizen, education, weight, height, eye_color, hair_color} = req.body;
    
        if(!student)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Суралцагчийн мэдээлэл байхгүй байна."
            })
        }
        if(!citizen)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Ангилал сонгоно уу."
            })
        }
        if(!education)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Автосургууль сонгоно уу."
            })
        }
        if(!weight)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Ургийн овог оруулна уу."
            })
        }
        if(!height)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Овог нэр оруулна уу."
            })
        }
        if(!eye_color)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Нэр оруулна уу."
            })
        }
        if(!hair_color)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Регистерийн дугаар оруулна уу."
            })
        }

        const studentExist = await prismaService.course_student.findFirst({
            where: {
                id: parseInt(student),
                course:parseInt(admin?.course)
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

        const isStudentMake = await prismaService.course_student_details.findFirst({
            where: {
                student: parseInt(student)
            }
        })

        if(isStudentMake)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Суралцагчийн нэмэлт мэдээлэл бүртгэгдсэн байна."
            })
        }

        const result = await prismaService.course_student_details.create({
            data: {
                student:parseInt(student),
                citizen,
                education,
                weight:parseInt(weight),
                height:parseInt(height),
                eye_color,
                hair_color,
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

module.exports = COURSE_POST_STUDENT_DETAILS