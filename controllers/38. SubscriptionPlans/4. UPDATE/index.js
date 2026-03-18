const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_SUBSCRIPTION_PLAN = async (req , res) => {
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

        const { name, description, price, duration, active} = req.body;

        await updateData(res, {
            model:`subscription_plan`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(name && { name }),
                ...(description && { description }),
                ...(price && { price:parseInt(price) }),
                ...(duration !== null && { duration:parseInt(duration) }),
                ...(active !== undefined && { active: parseInt(active) }),
                
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

module.exports = UPDATE_SUBSCRIPTION_PLAN