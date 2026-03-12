const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService");

const OWNER_UPDATE_COURSE_ACCOUNT = async (req , res) => {
    try 
    {
        const owner = req.user;

        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const data = await prismaService.course_account.findFirst({
            where:{
                id:parseInt(id),
                course:parseInt(owner?.id)
            }
        })

        if(!data)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Мэдээлэл устсан эсвэл байхгүй байна."
            })
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
                ...(active !== undefined || iban !== undefined && { updated_at: new Date() }),
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

module.exports = OWNER_UPDATE_COURSE_ACCOUNT