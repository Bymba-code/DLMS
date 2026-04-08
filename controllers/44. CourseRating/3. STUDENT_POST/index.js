const { insertData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService") 

const STUDENT_POST_COURSE_RATING = async (req, res) => {
    try {
        const student = req.user;
        const {teacherQuality, carQuality, attitudeQuality, organizationQuality, resultQuality ,comment} = req.body;

        if(!teacherQuality)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Багшийн үнэлгээ сонгоно уу."
            })
        }
        if(!carQuality)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Автомашины үнэлгээ оруулна уу."
            })
        }
        if(!attitudeQuality)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хандлага үнэлгээ оруулна уу."
            })
        }        
        if(!organizationQuality)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Зохион байгуулалтын үнэлгээ сонгоно уу."
            })
        }
        if(!resultQuality)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Үр дүн хэр байсан бэ?"
            })
        }

        const data = await prismaService.course_rating.create({
            data: {
                course:parseInt(student?.course),
                student:parseInt(student?.id),
                teacher_quality:parseInt(teacherQuality),
                car_quality:parseInt(carQuality),
                attitude_quality:parseInt(attitudeQuality),
                organization_quality:parseInt(organizationQuality),
                result_quality:parseInt(resultQuality),
                comment:comment ? comment : "",
                date: new Date()
            }
        })

        return res.status(200).json({
            success:true,
            data:data,
            message: "Амжилттай."
        })


    } catch (err) {
        console.error("POST_COURSE error:", err)
        return res.status(500).json({
            success: false,
            data:    [],
            message: err?.message || "Серверт алдаа гарлаа."
        })
    }
}

module.exports = STUDENT_POST_COURSE_RATING