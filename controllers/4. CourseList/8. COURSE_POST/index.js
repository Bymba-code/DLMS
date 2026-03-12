const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const COURSE_POST_LIST = async (req , res) => {
    try 
    {
        const course = req.user 
        const { list } = req.body;

        if(!list)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Онцлог сонгоно уу."
            })
        }
        
        await insertData(res, { model: 'course_list', data: { course: parseInt(course?.id), list: list}})
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

module.exports = COURSE_POST_LIST