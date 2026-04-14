const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const COURSE_GET_ALL_STUDENT_DEDU_REQUEST = async (req, res) => {
    try 
    {
        const admin = req.user;

        const {
            page,
            limit,
            search,
            orderBy,
            order,
        } = req.query;

        const where = {

        };

        where.course = parseInt(admin?.course)

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['kode'], 
            value: search
        } : null;

        const include = {};

        return await storeData(res, 'course_student_dedu_request', {
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

module.exports = COURSE_GET_ALL_STUDENT_DEDU_REQUEST ;