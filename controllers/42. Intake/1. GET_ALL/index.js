const prismaService = require("../../../services/prismaService");

const GET_ALL_COURSE_INTAKE = async (req, res) => {
    try {
        const user = req.user;

        const { page, limit, search, orderBy, order, branch, category } = req.query;

        const where = {};
        where.course = parseInt(user?.course);
        if (branch)   where.branch          = parseInt(branch);
        if (category) where.course_category = parseInt(category);

        // Search нэмэлт
        if (search) where.name = { contains: search };

        const orderByObj = orderBy ? { [orderBy]: order || "asc" } : { id: "desc" };

        const skip = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined;
        const take = limit ? parseInt(limit) : undefined;

        // ── 1. Элсэлтүүдийг татна ──
        const [intakes, totalCount] = await Promise.all([
            prismaService.course_intake.findMany({
                where,
                orderBy: orderByObj,
                skip,
                take,
                include: {
                    course_category_course_intake_course_categoryTocourse_category: {
                        include: { category_course_category_categoryTocategory: true },
                    },
                    branches: true,
                    _count: { select: { course_student: true } },
                },
            }),
            prismaService.course_intake.count({ where }),
        ]);

        if (intakes.length === 0) {
            return res.status(200).json({
                success: true,
                data:    [],
                count:   0,
                message: "Амжилттай.",
            });
        }

        // ── 2. Бүх intake-ийн суралцагчдыг нэг query-д татна (N+1 зайлсхийнэ) ──
        const intakeIds = intakes.map(i => i.id);

        const allStudents = await prismaService.course_student.findMany({
            where: {
                intake: { in: intakeIds },
                course: parseInt(user?.course),
            },
            select: {
                id:        true,
                intake:    true,
                active:    true,
                completed: true,
                course_student_category: {
                    select: {
                        payment: true,
                        course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category: {
                            select: { status: true, amount: true },
                        },
                    },
                },
            },
        });

        // ── 3. Intake тус бүрт суралцагчдыг групплэнэ ──
        const studentsByIntake = {};
        for (const s of allStudents) {
            if (!s.intake) continue;
            if (!studentsByIntake[s.intake]) studentsByIntake[s.intake] = [];
            studentsByIntake[s.intake].push(s);
        }

        // ── 4. Intake тус бүрийн нэгтгэл тооцоо ──
        const enriched = intakes.map(intake => {
            const students = studentsByIntake[intake.id] || [];

            let expectedTotal = 0;
            let paidAmount    = 0;

            for (const s of students) {
                for (const cat of s.course_student_category || []) {
                    expectedTotal += parseFloat(cat.payment || 0);

                    const payments =
                        cat.course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category || [];

                    for (const p of payments) {
                        if (p.status === "paid") {
                            paidAmount += parseFloat(p.amount || 0);
                        }
                    }
                }
            }

            const remainingAmount = Math.max(0, expectedTotal - paidAmount);
            const paymentPct = expectedTotal > 0
                ? Math.round((paidAmount / expectedTotal) * 100) : 0;

            // Суралцагчийн статус тоо
            const totalStudents     = students.length;
            const activeStudents    = students.filter(s => s.active === 1).length;
            const completedStudents = students.filter(s => s.completed === 1).length;
            const inactiveStudents  = students.filter(s => s.active === 0).length;

            // Бүрэн төлсөн тоо
            const fullyPaidStudents = students.filter(s => {
                let exp = 0, paid = 0;
                for (const cat of s.course_student_category || []) {
                    exp += parseFloat(cat.payment || 0);
                    const payments =
                        cat.course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category || [];
                    for (const p of payments) {
                        if (p.status === "paid") paid += parseFloat(p.amount || 0);
                    }
                }
                return exp > 0 && Math.max(0, exp - paid) === 0;
            }).length;

            // Ангилалын нэр
            const categoryName =
                intake.course_category_course_intake_course_categoryTocourse_category
                    ?.category_course_category_categoryTocategory?.name ?? null;

            return {
                ...intake,
                categoryName,
                paymentStats: {
                    expectedTotal,
                    paidAmount,
                    remainingAmount,
                    paymentPct,
                },
                studentStats: {
                    total:     totalStudents,
                    active:    activeStudents,
                    completed: completedStudents,
                    inactive:  inactiveStudents,
                    fullyPaid: fullyPaidStudents,
                },
            };
        });

        return res.status(200).json({
            success: true,
            data:    enriched,
            count:   totalCount,
            message: "Амжилттай.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data:    [],
            message: "Серверийн алдаа гарлаа. " + err,
        });
    }
};

module.exports = GET_ALL_COURSE_INTAKE;