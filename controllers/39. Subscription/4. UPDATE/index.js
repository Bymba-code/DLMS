const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const COURSE_UPDATE_SUBSCRIPTION_PLAN = async (req , res) => {
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

        const { plan } = req.body;

        await updateData(res, {
            model:`course_subscription`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(plan && { plan:parseInt(plan) }),
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

module.exports = COURSE_UPDATE_SUBSCRIPTION_PLAN