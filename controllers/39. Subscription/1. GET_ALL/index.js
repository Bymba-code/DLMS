const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const COURSE_GET_ALL_SUBSCRIPTION_PLAN = async (req, res) => {
    try 
    {
        const user = req.user;

        const {
            page,
            limit,
            search,
            orderBy,
            order,
            active
        } = req.query;

        const where = {}

        if(active) where.active === parseInt(active)

        where.course = parseInt(user?.course)

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['name'], 
            value: search
        } : null;

        const include = {
            subscription_plan:true,
            course_subscription_invoice:true
        };

        return await storeData(res, 'course_subscription', {
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

module.exports = COURSE_GET_ALL_SUBSCRIPTION_PLAN ;