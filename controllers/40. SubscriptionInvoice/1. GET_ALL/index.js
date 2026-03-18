const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const COURSE_GET_ALL_SUBSCRIPTION_INVOICE = async (req, res) => {
    try 
    {
        const {
            page,
            limit,
            search,
            orderBy,
            order
        } = req.query;

        const where = {}

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['name'], 
            value: search
        } : null;

        const include = {
            course_subscription:{
                include:{
                    subscription_plan:true
                }
            }
        };

        return await storeData(res, 'course_subscription_invoice', {
            where,
            orderBy: orderByObj,
            page: page ? parseInt(page) : null,
            limit: limit ? parseInt(limit) : null,
            include,
            search: searchOptions
        });

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

module.exports = COURSE_GET_ALL_SUBSCRIPTION_INVOICE ;