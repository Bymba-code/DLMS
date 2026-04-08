const { insertData, updateData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService") 

const COURSE_POST_GROUP = async (req , res) => {
    try 
    {
        const user = req.user;

        const {category, name, capacity, start_date, end_date} = req.body;

        if(!category)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Ангилал сонгоно уу."
            })
        }
        if(!name)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Машины төрөл оруулна уу."
            })
        }
        if(!capacity)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Дүүрэх багтаамж оруулна уу."
            })
        }
        if(!start_date)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Эхлэх хугацаа оруулна уу."
            })
        }
        if(!end_date)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Дуусах хугацаа оруулна уу."
            })
        }

        const data = await prismaService.course_category.findFirst({
            where:{
                category:parseInt(category),
                course:parseInt(user?.course)
            }
        })

        if(!data)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Сонгосон ангилал олдсонгүй."
            })
        }

        await insertData(res, { model: 'course_group', data: { course:parseInt(user?.course), category:parseInt(category), name, capacity:parseInt(capacity), start_date: new Date(start_date), end_date: new Date(end_date), created_at:new Date()}})
    }
    catch(err)
    {

    }
}

module.exports = COURSE_POST_GROUP