const { insertData } = require("../../../services/controllerService")

const POST_COURSE_ACCOUNT = async (req , res) => {
    try 
    {
        const {course, bank, iban, account, active} = req.body;

        if(!course)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Автосургууль сонгоно уу."
            })
        }
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

        await insertData(res, { model: 'course_account', data: { course:parseInt(course), bank:parseInt(bank), iban, account, active: active ? 1 : 0, created_at: new Date()}})
    }
    catch(err)
    {

    }
}

module.exports = POST_COURSE_ACCOUNT