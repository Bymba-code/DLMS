const { insertData, updateData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService") 

const COURSE_POST_GROUP_STUDENT = async (req , res) => {
    try 
    {
        const user = req.user;

        const {course_group, student} = req.body;

        if(!course_group)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Грүпп сонгоно уу."
            })
        }
        if(!student)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Суралцагч сонгоно уу."
            })
        }

        const existGroup = await prismaService.course_group.findFirst({
            where:{
                id:parseInt(course_group),
                course:parseInt(user?.course)
            }
        })

        if(!existGroup)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Грүппийн мэдээлэл устсан эсвэл байхгүй байна."
            })
        }

        const existStudent = await prismaService.course_student.findFirst({
            where:{
                id:parseInt(student),
                course:parseInt(user?.course)
            }
        })

        if(!existStudent)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Суралцагчийн мэдээлэл устсан эсвэл байхгүй байна."
            })
        }
        

        await insertData(res, { model: 'course_group_to_student', data: { course_group:parseInt(course_group), student:parseInt(student), created_at: new Date()}})
    }
    catch(err)
    {

    }
}

module.exports = COURSE_POST_GROUP_STUDENT