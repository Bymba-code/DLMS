const { insertData } = require("../../../services/controllerService")

const OWNER_POST_COURSE_ACCOUNT = async (req , res) => {
    try 
    {
        const owner = req.user;

        const {bank, iban, account, active} = req.body;

        if(!bank)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Банк сонгоно уу."
            })
        }
        if(!iban)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "IBAN дугаар оруулна уу."
            })
        }
        if(!account)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Дансны дугаар оруулна уу."
            })
        }

        await insertData(res, { model: 'course_account', data: { course:parseInt(owner?.course), bank:parseInt(bank), iban, account, active: active ? 1 : 0, created_at: new Date()}})
    }
    catch(err)
    {

    }
}

module.exports = OWNER_POST_COURSE_ACCOUNT