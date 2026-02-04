const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt");
const prismaService = require("../../../services/prismaService");

const UPDATE_COURSE_LIST = async (req , res) => {
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


        const existData = await prismaService.course_list.findFirst({
            where: {
                id: parseInt(id),
                course:parseInt(course?.id)
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

        const { list } = req.body;

        await updateData(res, {
            model:`course_list`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(list && { list })
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

module.exports = UPDATE_COURSE_LIST