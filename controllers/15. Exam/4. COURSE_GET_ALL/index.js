const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const COURSE_GET_ALL_EXAM = async (req, res) => {
    try 
    {
        const user = req.user

        const {
            page,
            limit,
            search,
            orderBy,
            order
        } = req.query;

        const where = {};

        where.course = parseInt(user?.course)
        where.isMake = 1


        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['name'], 
            value: search
        } : null;

        const include = {
            category_exam_categoryTocategory:true,
            course_student:true
        };

        return await storeData(res, 'exam', {
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

module.exports = COURSE_GET_ALL_EXAM ;