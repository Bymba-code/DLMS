const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const COURSE_GET_ALL_BRANCHES = async (req, res) => {
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

        where.course = parseInt(course?.id)

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['kode'], 
            value: search
        } : null;

        const include = {
                course_branches_courseTocourse:true,
                city_branches_cityTocity:true,
                district_branches_districtTodistrict:true,
                wards:true,
            _count:{
                select:{
                    course_student:true
                }
            }
        };
            
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

module.exports = COURSE_GET_ALL_BRANCHES ;