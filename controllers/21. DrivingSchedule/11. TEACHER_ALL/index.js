const { storeData } = require("../../../services/controllerService");

const TEACHER_GET_ALL_DRIVING_SCHEDULE = async (req, res) => {
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

        const include = { course_cars:true,
                course_student_driving_schedule_course_student_driving_schedule_driving_scheduleTodriving_schedule:{
                    include:{
                        course_student:true
                    }
                },
                course_teachers:true,
                category_driving_schedule_categoryTocategory:true};

        return await storeData(res, 'driving_schedule', {
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

module.exports = TEACHER_GET_ALL_DRIVING_SCHEDULE ;