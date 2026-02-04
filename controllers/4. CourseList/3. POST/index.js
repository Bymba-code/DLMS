const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService"); 
const { default: axios } = require("axios");

const POST_COURSE_LIST = async (req , res) => {
    try 
    {
        const { course, list } = req.body;

        if(!course)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Автосургууль сонгоно уу."
            })
        }
        if(!list)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Онцлог сонгоно уу."
            })
        }

        
        const result = await prismaService.course_list.create({
            data: {
                course:parseInt(course),
                list: list
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
        return res.status(500).json({
            success:false,
            data:[],
            message: "Серверийн алдаа гарлаа."
        })
    }
}

module.exports = POST_COURSE_LIST