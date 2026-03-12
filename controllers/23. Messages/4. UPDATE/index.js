const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_MESSAGE = async (req , res) => {
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

        const {title, message, isRead} = req.body;

        await updateData(res, {
            model:`messages`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(title && { title }),
                ...(message && { message }),
                ...(isRead && { isRead }),
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

module.exports = UPDATE_MESSAGE