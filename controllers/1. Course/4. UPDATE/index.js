const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_COURSE = async (req , res) => {
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

        const {name, kode, password, city, district, horoo, location, phone,shortdesc} = req.body;


        let hashed;
        const salt = await bcrypt.genSalt(10)

        if(password)
        {
            hashed = await bcrypt.hash(password, salt)
        }
        
        await updateData(res, {
            model:`course`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(name && { name }),
                ...(kode && { kode }),
                ...(password && { password:hashed }),
                ...(city && { city }),
                ...(district && { district }),
                ...(horoo && { horoo }),
                ...(location && { location }),
                ...(phone && { phone }),
                ...(shortdesc && { shortdesc }),
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

module.exports = UPDATE_COURSE