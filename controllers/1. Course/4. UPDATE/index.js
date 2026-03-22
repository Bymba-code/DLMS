const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_COURSE = async (req , res) => {
    try 
    {
        const user = req.user;

        const {name,city, district, horoo, location, phone,shortdesc} = req.body;
        
        await updateData(res, {
            model:`course`,
            whereClause: { id: parseInt(user?.course)},
            data: {
                ...(name && { name }),
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