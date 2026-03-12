const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_COURSE_CATEGORY = async (req , res) => {
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

module.exports = UPDATE_COURSE_CATEGORY