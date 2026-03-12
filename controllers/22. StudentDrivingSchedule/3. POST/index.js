const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const POST_STUDENT_DRIVING_SCHEDULE = async (req , res) => {
    try 
    {
        const {student, driving_schedule} = req.body;

        if(!student)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Суралцагч сонгоно уу."
            })
        }

        if(!driving_schedule)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хуваарь сонгоно уу."
            })
        }

        
        await insertData(res, { model: 'course_student_driving_schedule', data: { student: parseInt(student), driving_schedule:parseInt(driving_schedule), attendance:0 , date: new Date() }})
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

module.exports = POST_STUDENT_DRIVING_SCHEDULE