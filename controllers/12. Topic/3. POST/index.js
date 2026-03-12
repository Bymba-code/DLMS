const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const POST_TOPIC = async (req , res) => {
    try 
    {
        const { name, category } = req.body;

        if(!name)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Сэдвийн нэр оруулна уу."
            })
        }

        if(!category)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Сэдвийн ангилал сонгоно уу."
            })
        }

        const existData = await prismaService.topic.findFirst({
            where: {
                name: name
            }
        })

        if(existData)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Тухайн сэдэв нэмэгдсэн байна."
            })
        }

        const existCategory = await prismaService.category.findUnique({
            where: {
                id:parseInt(category)
            }
        })

        if(!existCategory)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Сонгосон ангилалын мэдээлэл олдсонгүй."
            })
        }
       
        await insertData(res, { model: 'topic', data: { name, category, date: new Date() }})
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

module.exports = POST_TOPIC