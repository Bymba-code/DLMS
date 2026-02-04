const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const TEACHER_POST_STUDENT_SCHEDULE = async (req , res) => {
    try 
    {
        const {student, schedule} = req.body;

        if(!student)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Суралцагч сонгоно уу."
            })
        }

        if(!schedule)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хуваарь сонгоно уу."
            })
        }

        
        await insertData(res, { model: 'course_student_schedule', data: { student: parseInt(student), schedule:parseInt(schedule), attendance:0 , date: new Date() }})
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

module.exports = TEACHER_POST_STUDENT_SCHEDULE