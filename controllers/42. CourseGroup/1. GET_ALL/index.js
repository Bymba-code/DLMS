const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const COURSE_GET_ALL_GROUP = async (req, res) => {
    try {
        const user = req.user;

        const {
            page,
            limit,
            search,
            orderBy,
            order
        } = req.query;

        const where = {};
        where.course = parseInt(user?.course);

        const orderByObj = {
            [orderBy]: order
        };

        const include = {
            course_category: {
                include:{
                    category_course_category_categoryTocategory:true
                }
            },
            course_group_to_student_course_group_to_student_course_groupTocourse_group: {
                include: {
                    course_student: {
                        include: {
                            course_student_category: {
                                include: {
                                    course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category: true
                                }
                            }
                        }
                    }
                }
            }
        };

        const searchOptions = search ? {
            fields: ['name'],
            value: search
        } : null;

        // storeData-р өгөгдөл авах
        const result = await prismaService.course_group.findMany({
            where,
            include,
            orderBy: orderByObj
        });

        const dataWithStats = result.map(group => {
            const students = group.course_group_to_student_course_group_to_student_course_groupTocourse_group
                .map(rel => rel.course_student)
                .filter(Boolean);

            const activeCount       = students.filter(s => s.active === 1).length;
            const inactiveCount     = students.filter(s => s.active === 0).length;
            const completedCount    = students.filter(s => s.completed === 1).length;
            const notCompletedCount = students.filter(s => s.completed === 0).length;
            const reasonCount       = students.filter(s => s.reason !== null).length;

            // Төлбөрийн тооцоо
            let totalShouldPay = 0;
            let totalPaid      = 0;

            students.forEach(student => {
                student.course_student_category?.forEach(cat => {
                    // Төлөх ёстой дүн
                    totalShouldPay += parseFloat(cat.payment || 0);

                    // Төлсөн дүн (amount-уудын нийлбэр)
                    cat.course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category
                        ?.forEach(payment => {
                            if (payment.amount) {
                                totalPaid += parseFloat(payment.amount || 0);
                            }
                        });
                });
            });

            return {
                id: group.id,
                course: group.course,
                category: group.category,
                name: group.name,
                capacity: group.capacity,
                start_date: group.start_date,
                end_date: group.end_date,
                created_at: group.created_at,
                updated_at: group.updated_at,
                course_category: group.course_category,
                stats: {
                    totalStudents: students.length,
                    activeCount,
                    inactiveCount,
                    completedCount,
                    notCompletedCount,
                    reasonCount,
                    payment: {
                        totalShouldPay,
                        totalPaid,
                        remaining: totalShouldPay - totalPaid
                    }
                }
            };
        });

        return res.status(200).json({
            success: true,
            data: dataWithStats,
            count: dataWithStats.length,
            message: 'Амжилттай.'
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = COURSE_GET_ALL_GROUP;