const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_COURSE_OWNER = async (req , res) => {
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

        const {firstname, lastname, phone, password, confirmPassword} = req.body;

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
                ...(password !== null && { password:hashed }),
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

module.exports = UPDATE_COURSE_OWNER