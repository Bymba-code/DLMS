const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const COURSE_GET_ALL_SCHEDULE = async (req, res) => {
    try 
    {
        const user = req.user;

        const {
            page,
            limit,
            search,
            orderBy,
            order,
            teacher,
            category
        } = req.query;

        const where = { };

        if(teacher) where.teacher = parseInt(teacher)
        if(category) where.category = parseInt(category)
        
        where.course = parseInt(user?.course)

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['list'], 
            value: search
        } : null;

        const include = {
            category_schedule_categoryTocategory:true,
            course_teachers:true
        };

        return await storeData(res, 'schedule', {
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

module.exports = COURSE_GET_ALL_SCHEDULE ;