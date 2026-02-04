const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const STUDENT_GET_ALL_DRIVING_SCHEDULE = async (req, res) => {
    try 
    {
        const student = req.user;

        const {
            page,
            limit,
            search,
            orderBy,
            order,
        } = req.query;

        const where = {};
        
        where.student = parseInt(student?.id)

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['name'], 
            value: search
        } : null;
      
        const include = {
            driving_schedule_course_student_driving_schedule_driving_scheduleTodriving_schedule:{
                include:{
                    course_cars:true,
                    course_teachers:true,
                    category_driving_schedule_categoryTocategory:true
                }
            }
        };

        return await storeData(res, 'course_student_driving_schedule', {
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

module.exports = STUDENT_GET_ALL_DRIVING_SCHEDULE ;