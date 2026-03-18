const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const OWNER_GET_ALL_COURSE_ACCOUNT = async (req, res) => {
    try 
    {
        const owner = req.user;

        const {
            page,
            limit,
            search,
            orderBy,
            order
        } = req.query;

        const where = {}

        where.course = parseInt(owner?.course)

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['name'], 
            value: search
        } : null;

        const include = {
            bank_course_account_bankTobank:true
        };

        return await storeData(res, 'course_account', {
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

module.exports = OWNER_GET_ALL_COURSE_ACCOUNT ;