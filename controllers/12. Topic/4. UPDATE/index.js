const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService")

const UPDATE_TOPIC = async (req , res) => {
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

        const { name, category } = req.body;

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

        await updateData(res, {
            model:`topic`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(name && { name }),
                ...(category && { category })
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

module.exports = UPDATE_TOPIC