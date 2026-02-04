const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const POST_TEST = async (req , res) => {
    try 
    {
        const { name, topic } = req.body;

        if(!name)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Тестийн асуулт оруулна уу."
            })
        }

        if(!topic)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Тестийн сэдэв сонгоно уу."
            })
        }

        const existData = await prismaService.test.findFirst({
            where: {
                name: name
            }
        })

        if(existData)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Тухайн тест нэмэгдсэн байна."
            })
        }

        const existTopic = await prismaService.topic.findUnique({
            where: {
                id:parseInt(topic)
            }
        })

        if(!existTopic)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Сонгосон сэдвийн мэдээлэл олдсонгүй."
            })
        }

        let img = ""

        if(req.file)
        {
            img = `/${req.file.path}`
        }
       
        await insertData(res, { model: 'test', data: { name, img , topic: parseInt(topic), date: new Date() }})
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

module.exports = POST_TEST