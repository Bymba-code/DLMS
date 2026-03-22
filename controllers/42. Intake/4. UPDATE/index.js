const { updateData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const UPDATE_COURSE_INTAKE = async (req , res) => {
    try 
    {
        const user = req.user;

        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const data = await prismaService.course_intake.findFirst({
            where:{
                id:parseInt(id),
                course:parseInt(user?.course)
            }
        })

        if(!data)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Мэдээлэл устсан эсвэл байхгүй байна."
            })
        }

        const {branch, course_category, name, capacity, start_date, end_date, active} = req.body;

        await updateData(res, {
            model:`course_intake`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(branch && { branch:parseInt(branch) }),
                ...(course_category && { course_category:parseInt(course_category) }),
                ...(name && { name }),
                ...(capacity && { capacity:parseInt(capacity) }),
                ...(start_date && { start_date: new Date(start_date) }),
                ...(end_date && { end_date: new Date(end_date) }),
                ...(active !== undefined && { active: parseInt(active) }),
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

module.exports = UPDATE_COURSE_INTAKE