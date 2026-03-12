const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const ADMIN_GET_ALL_BRANCHES = async (req, res) => {
    try 
    {
        const course = req.user;

        const {
            page,
            limit,
            search,
            orderBy,
            order,
        } = req.query;

        const where = {};

        where.course = parseInt(course?.course)

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['kode'], 
            value: search
        } : null;

        const include = {};

        return await storeData(res, 'branches', {
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

module.exports = ADMIN_GET_ALL_BRANCHES ;