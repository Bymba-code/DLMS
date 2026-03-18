const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const POST_CAR_TYPE = async (req , res) => {
    try 
    {
        const {name} = req.body;

        if(!name)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Машины төрөл оруулна уу."
            })
        }

        await insertData(res, { model: 'car_type', data: { name, created_at: new Date() }})
    }
    catch(err)
    {

    }
}

module.exports = POST_CAR_TYPE