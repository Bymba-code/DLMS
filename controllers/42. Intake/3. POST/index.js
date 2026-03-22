const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const POST_COURSE_INTAKE = async (req , res) => {
    try 
    {
        const user = req.user;

        const {branch, course_category, name, capacity, start_date, end_date} = req.body;

        if(!branch)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Салбар сонгоно уу."
            })
        }
        if(!course_category)
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
                message: "Дүүрэх тоо оруулна уу."
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

        await insertData(res, { model: 'course_intake', data: { course: parseInt(user?.course), branch:parseInt(branch), name, course_category:parseInt(course_category), capacity:parseInt(capacity), active:1, created_at:new Date(), updated_at:new Date(), start_date:new Date(start_date), end_date: new Date(end_date)}})
    }
    catch(err)
    {

    }
}

module.exports = POST_COURSE_INTAKE