const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const POST_CATEGORY = async (req , res) => {
    try 
    {
        const { name } = req.body;

        if(!name)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Ангилалын нэр оруулна уу."
            })
        }

        const existData = await prismaService.category.findFirst({
            where: {
                name: name
            }
        })

        if(existData)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Тухайн ангилал нэмэгдсэн байна."
            })
        }
       
        await insertData(res, { model: 'category', data: { name }})
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

module.exports = POST_CATEGORY