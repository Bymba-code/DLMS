const { updateData } = require("../../../services/controllerService")

const UPDATE_CAR_TYPE = async (req , res) => {
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

        const {name} = req.body;

        await updateData(res, {
            model:`car_Type`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(name && { name })
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

module.exports = UPDATE_CAR_TYPE