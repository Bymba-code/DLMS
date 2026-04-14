const { storeSingleData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const GET_SINGLE_COURSE = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const where = { id: parseInt(id) };


        const include = {
            course_category_course_category_courseTocourse: true,
            course_images_course_images_courseTocourse: true,
            course_list_course_list_courseTocourse: true,
            course_rating_course_rating_courseTocourse:{
                include:{
                    course_student:true
                }
            },
            course_student_course_student_courseTocourse: true,
            branches_branches_courseTocourse: true
        };

        // ✅ res.json override хийж stats тооцоолно
        const originalJson = res.json.bind(res);
        res.json = (payload) => {
            if (!payload.success || !payload.data) {
                return originalJson(payload);
            }

            const ratingFields = [
                'teacher_quality',
                'car_quality',
                'attitude_quality',
                'organization_quality',
                'result_quality'
            ];

            const course = payload.data;
            const ratings = course.course_rating_course_rating_courseTocourse || [];
            const students = course.course_student_course_student_courseTocourse || [];
            const branches = course.branches_branches_courseTocourse || [];

            // ✅ Үнэлгээний дундаж
            let average_rating = null;
            if (ratings.length > 0) {
                const totalAvg = ratings.reduce((sum, r) => {
                    const rowAvg = ratingFields.reduce((s, f) => s + (r[f] || 0), 0) / ratingFields.length;
                    return sum + rowAvg;
                }, 0);
                average_rating = parseFloat((totalAvg / ratings.length).toFixed(2));
            }

            return originalJson({
                ...payload,
                data: {
                    ...course,
                    stats: {
                        average_rating,
                        rating_count: ratings.length,
                        total_student_count: students.length,
                        completed_student_count: students.filter(s => s.completed === 1).length,
                        branch_count: branches.length
                    }
                }
            });
        };

        return await storeSingleData(res, 'course', {
            where,
            include
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: null,
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = GET_SINGLE_COURSE;