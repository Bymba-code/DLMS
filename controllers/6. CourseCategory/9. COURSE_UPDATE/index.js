const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt");
const prismaService = require("../../../services/prismaService");

const COURSE_UPDATE_CATEGORY = async (req , res) => {
    try 
    {
        const course = req.user;
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const existData = await prismaService.course_category.findFirst({
            where: {
                id:parseInt(id),
                course: parseInt(course?.id)
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

        const {registerPrice, price} = req.body;

        await updateData(res, {
            model:`course_category`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(registerPrice && { registerPrice: parseInt(registerPrice) }),
                ...(price && { price: parseInt(price) }),

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

module.exports = COURSE_UPDATE_CATEGORY