const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const USER_GET_ALL_DEVICE = async (req, res) => {
    try 
    {
        const user = req.user;

        const {
            page,
            limit,
            search,
            orderBy,
            order,
            car,

        } = req.query;

        const where = {};

        where.user = parseInt(user?.id)

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['list'], 
            value: search
        } : null;

        const include = {};

        return await storeData(res, 'course_user_device', {
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

module.exports = USER_GET_ALL_DEVICE ;