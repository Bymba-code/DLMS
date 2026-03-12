const { storeData } = require("../../../services/controllerService");

const TEACHER_GET_ALL_SCHEDULE = async (req, res) => {
    try 
    {
        const teacher = req.user;

        const {
            page,
            limit,
            search,
            orderBy,
            order,
        } = req.query;

        const where = {};
        
        where.teacher = parseInt(teacher?.id)

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['list'], 
            value: search
        } : null;

        const include = {course_student_schedule_course_student_schedule_scheduleToschedule:{
                    include:{
                        course_student:true
                    }
                },
                course_teachers:true,
                category_schedule_categoryTocategory:true};

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

module.exports = TEACHER_GET_ALL_SCHEDULE ;