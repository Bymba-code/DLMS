const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_COURSE_ACCOUNT = async (req , res) => {
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

        const {bank, iban, account, active} = req.body;

        await updateData(res, {
            model:`course_account`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(bank && { bank:parseInt(bank) }),
                ...(iban && { iban }),
                ...(account && { account }),
                ...(active !== undefined && { active: parseInt(active) }),
                ...(active !== undefined || name !== undefined && { updated_at: new Date() }),
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

module.exports = UPDATE_COURSE_ACCOUNT