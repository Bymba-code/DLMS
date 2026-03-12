const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService");

const OWNER_UPDATE_OWNER = async (req , res) => {
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

        const data = await prismaService.course_owners.findFirst({
            where:{
                id:parseInt(id),
                course:parseInt(owner?.course)
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

        const {firstname, lastname, phone, password, confirmPassword, active} = req.body;

        let file = null;
        let hashed = null

        if(req.file)
        {
            file = `/${req.file.path}`
        }

        if(password)
        {
            if(password !== confirmPassword)
            {
                return res.status(400).json({
                    success:false,
                    data:[],
                    message: "Нууц үг таарахгүй байна."
                })
            }

            const salt = await bcrypt.genSalt(10)
            hashed = await bcrypt.hash(password, salt)
        }

        await updateData(res, {
            model:`course_owners`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(firstname && { firstname }),
                ...(lastname && { lastname }),
                ...(phone && { phone }),
                ...(file !== null && { avatar:file }),
                ...(active !== undefined && { active: parseInt(active) }),
                ...(password !== undefined && { password:hashed }),
                ...(firstname !== null || lastname !== null || phone !== null || active !== null || password !== null && { updated_at: new Date() }),
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

module.exports = OWNER_UPDATE_OWNER