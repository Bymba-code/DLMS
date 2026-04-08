const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const STUDENT_GET_ALL_COURSE_RATING = async (req, res) => {
    try 
    {
        const student = req.user;

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

        where.student = parseInt(student?.id)
        where.course = parseInt(student?.course)

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['name'], 
            value: search
        } : null;

        const include = {};

        return await storeData(res, 'course_rating', {
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

module.exports = STUDENT_GET_ALL_COURSE_RATING ;