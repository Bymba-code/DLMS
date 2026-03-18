const { insertData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService"); 

const COURSE_POST_BRANCHES = async (req , res) => {
    try 
    {
        const course = req.user;

        const {name, code, phone, email, city, district, ward, location, map, active} = req.body;

        if(!name)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Салбарийн нэр оруулна уу."
            })
        }
        if(!phone)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Салбарын холбогдох дугаар оруулна уу."
            })
        }
        if(!email)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Салбарын И-Мейл хаяг оруулна уу."
            })
        }
        if(!city)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хот / Аймаг сонгоно уу."
            })
        }
        if(!district)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Дүүрэг / Сум сонгоно уу."
            })
        }
        if(!ward)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хороо / баг сонгоно уу."
            })
        }
        if(!location)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Тодорой хаяг бичиж оруулна уу."
            })
        }
        if(!map)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Газрын зургаас байршил сонгоно уу."
            })
        }

        const existBranch = await prismaService.branches.findFirst({
            where:{
                name: name,
                course: parseInt(course?.course)
            }
        })

        if(existBranch)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Салбар бүртгэгдсэн байна."
            })
        }

        const result = await prismaService.branches.create({
            data: {
                course: parseInt(course?.course),
                name:name,
                code: code ? code : "",
                phone:phone,
                email,
                city:parseInt(city),
                district:parseInt(district),
                ward: parseInt(ward),
                location,
                map,
                active:(active !== undefined && active !== null && parseInt(active) || 0 ),
                created_at: new Date()
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

module.exports = COURSE_POST_BRANCHES