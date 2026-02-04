const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const GET_ALL_CATEGORY = async (req, res) => {
    try 
    {
        const {
            page,
            limit,
            search,
            orderBy,
            order,
            phone,
            city,
            district,
            horoo, 
            featured
        } = req.query;

        const where = {};


        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['name'], 
            value: search
        } : null;

        const include = {
                
            };

        return await storeData(res, 'category', {
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

module.exports = GET_ALL_CATEGORY ;