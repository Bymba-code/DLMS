const { updateData } = require("../../../services/controllerService")

const STUDENT_UPDATE_MESSAGE = async (req , res) => {
    try 
    {
        const student = req.user;

        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const {isRead} = req.body;

        await updateData(res, {
            model:`messages`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(isRead && { isRead: parseInt(isRead) }),
                ...({ read_at: new Date() }),

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

module.exports = STUDENT_UPDATE_MESSAGE