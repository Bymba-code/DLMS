const { storeData } = require("../../../services/controllerService");

const GET_ALL_COURSE_LIST = async (req, res) => {
    try 
    {
        const {
            page,
            limit,
            search,
            orderBy,
            order,
        } = req.query;

        const where = {};

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['list'], 
            value: search
        } : null;

        const include = {};

        return await storeData(res, 'course_list', {
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

module.exports = GET_ALL_COURSE_LIST ;