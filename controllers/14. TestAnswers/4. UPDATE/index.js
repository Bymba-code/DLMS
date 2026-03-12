const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService")

const UPDATE_TEST_ANSWERS = async (req , res) => {
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

        const { test, title, isSuccess } = req.body;

        await updateData(res, {
            model:`test_answers`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(test && { test }),
                ...(title && { title }),
                ...(isSuccess && { isSuccess: !isSuccess || isSuccess === null || isSuccess === undefined ? 0 : isSuccess })
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

module.exports = UPDATE_TEST_ANSWERS