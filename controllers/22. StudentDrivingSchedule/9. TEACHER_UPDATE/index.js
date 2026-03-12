const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService")

const TEACHER_UPDATE_DRIVING_SCHEDULE = async (req , res) => {
    try 
    {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const {attendance, note} = req.body;

        await updateData(res, {
            model:`course_student_driving_schedule`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(attendance !== undefined && attendance !== null && { 
    attendance: parseInt(attendance) || 0 
}),
                ...(note && { note}),
                ...( { update_date: new Date()})
            }
        })

        
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data:[],
            message: "Серверийн алдаа гарлаа." + err
        })
    }
}

module.exports = TEACHER_UPDATE_DRIVING_SCHEDULE