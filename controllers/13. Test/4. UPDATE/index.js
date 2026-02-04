const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService")

const UPDATE_TEST = async (req , res) => {
    try 
    {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const { name, topic } = req.body;

        let img = "";

        if(req.file)
        {
            img = `/${req.file.path}`
        }

        if(name)
        {
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
        }

        if(topic)
        {
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
        }

        await updateData(res, {
            model:`test`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(name && { name }),
                ...(topic && { topic }),
                ...(img && { img })
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

module.exports = UPDATE_TEST