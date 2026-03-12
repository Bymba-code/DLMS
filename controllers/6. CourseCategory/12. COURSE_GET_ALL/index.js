const { storeData } = require("../../../services/controllerService");

const OWNER_GET_ALL = async (req, res) => {
    try 
    {
        const owner = req.user;

        const {
            page,
            limit,
            search,
            orderBy,
            order,
            
        } = req.query;

        const where = {};
        
        where.course = parseInt(owner?.id)

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['list'], 
            value: search
        } : null;

        const include = {category_course_category_categoryTocategory:true};

        return await storeData(res, 'course_category', {
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

module.exports = OWNER_GET_ALL ;