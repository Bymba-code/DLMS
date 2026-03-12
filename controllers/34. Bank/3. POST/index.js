const { insertData } = require("../../../services/controllerService")

const POST_BANK = async (req , res) => {
    try 
    {
        const {name, active} = req.body;

        if(!name)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Банкны нэрийг оруулна уу."
            })
        }


        await insertData(res, { model: 'bank', data: { name, active: active ? 1 : 0, created_at: new Date()}})
    }
    catch(err)
    {

    }
}

module.exports = POST_BANK