const { storeData } = require("../../../services/controllerService");

const GET_ALL_COURSE = async (req, res) => {
    try {
        const {
            page, limit, search, orderBy, order,
            phone, city, district, horoo, featured
        } = req.query;

        const where = {};
        if (phone) where.phone = phone;
        if (city) where.city = parseInt(city);
        if (district) where.district = parseInt(district);
        if (horoo) where.horoo = parseInt(horoo);
        if (featured) where.featured = parseInt(featured);

        const orderByObj = orderBy ? { [orderBy]: order } : undefined;
        const searchOptions = search ? { fields: ['name'], value: search } : null;

        const include = {
            course_category_course_category_courseTocourse: true,
            course_images_course_images_courseTocourse: true,
            course_list_course_list_courseTocourse: true,
            course_rating_course_rating_courseTocourse: true,
            course_student_course_student_courseTocourse: true,
            branches_branches_courseTocourse: true
        };

        // ✅ res.json-г override хийж data-г барьж авна
        const originalJson = res.json.bind(res);
        res.json = (payload) => {
            if (!payload.success || !Array.isArray(payload.data)) {
                return originalJson(payload);
            }

            const ratingFields = [
                'teacher_quality',
                'car_quality', 
                'attitude_quality',
                'organization_quality',
                'result_quality'
            ];

            const processedData = payload.data.map(course => {
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

                // ✅ Completed = 1 сурагчдын тоо
                const completed_student_count = students.filter(s => s.completed === 1).length;

                // ✅ Нийт сурагчдын тоо
                const total_student_count = students.length;

                // ✅ Салбарын тоо
                const branch_count = branches.length;

                return {
                    ...course,
                    stats: {
                        average_rating,
                        rating_count: ratings.length,
                        total_student_count,
                        completed_student_count,
                        branch_count
                    }
                };
            });

            return originalJson({
                ...payload,
                data: processedData
            });
        };

        return await storeData(res, 'course', {
            where,
            orderBy: orderByObj,
            page: page ? parseInt(page) : null,
            limit: limit ? parseInt(limit) : null,
            include,
            search: searchOptions
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = GET_ALL_COURSE;