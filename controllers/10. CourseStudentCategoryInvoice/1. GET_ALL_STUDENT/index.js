const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const STUDENT_GET_ALL_CATEGORY_INVOICE = async (req, res) => {
    try 
    {
        

    } 
    catch(err) 
    {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = STUDENT_GET_ALL_CATEGORY_INVOICE ;