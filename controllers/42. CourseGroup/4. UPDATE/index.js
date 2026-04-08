const { updateData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const COURSE_UPDATE_GROUP = async (req , res) => {
    try 
    {
        const user = req.user;

        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const {category, name, capacity, start_date, end_date} = req.body;

        const existData = await prismaService.course_group.findFirst({
            where:{
                id:parseInt(id),
                course:parseInt(user?.course)
            }
        })

        if(!existData)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Мэдээлэл устсан эсвэл байхгүй байна."
            })
        }

        if(category)
        {
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
        }

        await updateData(res, {
            model:`course_group`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(category && { category:parseInt(category) }),
                ...(name && { name:name }),
                ...(capacity && { capacity:parseInt(capacity) }),
                ...(start_date && { start_date:new Date(start_date) }),
                ...(end_date && { end_date:new Date(end_date) }),
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

module.exports = COURSE_UPDATE_GROUP