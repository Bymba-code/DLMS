const { updateData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService") 

const STUDENT_UPDATE_COURSE_RATING = async (req , res) => {
    try 
    {
        const student = req.user;

        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const data = await prismaService.course_rating.findFirst({
            where:{
                student:parseInt(student?.id),
                course: parseInt(student?.course),
                id:parseInt(id)
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

        const {teacherQuality, carQuality, attitudeQuality, organizationQuality, resultQuality ,comment} = req.body;
        
        await updateData(res, {
            model:`course_rating`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(teacherQuality !== undefined && { teacher_quality:parseInt(teacherQuality) }),
                ...(carQuality !== undefined && { car_quality: parseInt(carQuality) }),
                ...(attitudeQuality !== undefined && { attitude_quality: parseInt(attitudeQuality) }),
                ...(organizationQuality !== undefined && { organization_quality:parseInt(organizationQuality) }),
                ...(resultQuality !== undefined && { result_quality:parseInt(resultQuality) }),
                ...(comment && { comment })
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

module.exports = STUDENT_UPDATE_COURSE_RATING