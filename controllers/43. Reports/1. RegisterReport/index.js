const prismaService = require("../../../services/prismaService");

const GET_REGISTER_REPORT = async (req, res) => {
    try {
        const user = req.user;

        const {
            year, month, branch, category, intake,
            active, completed, paymentStatus, // paymentStatus: "paid" | "partial" | "unpaid"
            page, limit,
        } = req.query;

        const courseId    = parseInt(user?.course);
        const now         = new Date();
        const targetYear  = year  ? parseInt(year)  : now.getFullYear();
        const targetMonth = month ? parseInt(month) : null;

        // ── 1. Огноогийн хүрээ ──
        let dateFrom, dateTo;
        if (targetMonth) {
            dateFrom = new Date(targetYear, targetMonth - 1, 1);
            dateTo   = new Date(targetYear, targetMonth,     1);
        } else {
            dateFrom = new Date(targetYear,     0, 1);
            dateTo   = new Date(targetYear + 1, 0, 1);
        }

        // ── 2. WHERE ──
        const where = {
            course: courseId,
            date: { gte: dateFrom, lt: dateTo },
        };
        if (branch)   where.branch = parseInt(branch);
        if (intake)   where.intake = parseInt(intake);
        if (category) where.category = { some: { category: parseInt(category) } };
        if (active    !== undefined && active    !== "") where.active    = parseInt(active);
        if (completed !== undefined && completed !== "") where.completed = parseInt(completed);

        // ── 3. Татах ──
        const skip = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined;
        const take = limit ? parseInt(limit) : undefined;

        const [students, totalCount] = await Promise.all([
            prismaService.course_student.findMany({
                where,
                orderBy: { date: "desc" },
                skip,
                take,
                include: {
                    branches: { select: { id: true, name: true } },
                    course_intake: {
                        select: {
                            id: true, name: true,
                            course_category_course_intake_course_categoryTocourse_category: {
                                select: {
                                    id: true, category: true,
                                    category_course_category_categoryTocategory: {
                                        select: { id: true, name: true },
                                    },
                                },
                            },
                        },
                    },
                    gender_course_student_genderTogender: { select: { id: true, gender: true } },
                    // Төлбөрийн бүрэн мэдээлэл
                    course_student_category: {
                        select: {
                            id: true, payment: true, category: true,
                            category_course_student_category_categoryTocategory: {
                                select: { id: true, name: true },
                            },
                            course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category: {
                                select: {
                                    id: true, status: true, amount: true,
                                    created_at: true, number: true, description: true,
                                },
                            },
                        },
                    },
                },
            }),
            prismaService.course_student.count({ where }),
        ]);

        // ── 4. Format — төлбөрийн тооцоо нэмэгдсэн ──
        const formatted = students.map(s => {
            const intakeName         = s.course_intake?.name ?? null;
            const intakeCategoryName =
                s.course_intake
                    ?.course_category_course_intake_course_categoryTocourse_category
                    ?.category_course_category_categoryTocategory?.name ?? null;
            const intakeCategoryId   =
                s.course_intake
                    ?.course_category_course_intake_course_categoryTocourse_category
                    ?.category ?? null;
            const categoryName =
                s.course_student_category?.[0]
                    ?.category_course_student_category_categoryTocategory?.name ?? null;
            const categoryId = s.course_student_category?.[0]?.category ?? null;

            // ── Төлбөрийн тооцоо ──
            let expectedTotal = 0;
            let paidAmount    = 0;
            let invoiceTotal  = 0;
            let totalInvoices = 0;
            let paidInvoices  = 0;

            // Сүүлийн төлсөн огноо
            let lastPaidDate  = null;

            for (const cat of s.course_student_category || []) {
                expectedTotal += parseFloat(cat.payment || 0);

                const payments =
                    cat.course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category || [];

                for (const p of payments) {
                    const amt = parseFloat(p.amount || 0);
                    invoiceTotal  += amt;
                    totalInvoices += 1;
                    if (p.status === "paid") {
                        paidAmount   += amt;
                        paidInvoices += 1;
                        if (p.created_at) {
                            const d = new Date(p.created_at);
                            if (!lastPaidDate || d > lastPaidDate) lastPaidDate = d;
                        }
                    }
                }
            }

            const remainingAmount = Math.max(0, expectedTotal - paidAmount);
            const paymentPct      = expectedTotal > 0 ? Math.round((paidAmount / expectedTotal) * 100) : 0;
            const fullyPaid       = expectedTotal > 0 && remainingAmount === 0;

            return {
                id:                  s.id,
                kode:                s.kode,
                familyname:          s.familyname,
                firstname:           s.firstname,
                lastname:            s.lastname,
                register:            s.register,
                phone:               s.phone,
                gender:              s.gender_course_student_genderTogender?.gender ?? null,
                active:              s.active,
                completed:           s.completed,
                reason:              s.reason,
                date:                s.date,
                branchId:            s.branch,
                branchName:          s.branches?.name ?? null,
                intakeId:            s.intake,
                intakeName,
                intakeCategoryId,
                intakeCategoryName,
                categoryId,
                categoryName,
                // ── Төлбөр ──
                expectedTotal,
                paidAmount,
                remainingAmount,
                invoiceTotal,
                totalInvoices,
                paidInvoices,
                paymentPct,
                fullyPaid,
                lastPaidDate,
            };
        });

        // ── 5. paymentStatus шүүлт (post-query) ──
        const afterPaymentFilter = paymentStatus
            ? formatted.filter(s => {
                if (paymentStatus === "paid")    return s.fullyPaid;
                if (paymentStatus === "partial") return s.paidAmount > 0 && !s.fullyPaid;
                if (paymentStatus === "unpaid")  return s.paidAmount === 0 && s.expectedTotal > 0;
                return true;
            })
            : formatted;

        // ── 6. Нэгтгэл ──
        const totalStudents      = afterPaymentFilter.length;
        const activeStudents     = afterPaymentFilter.filter(s => s.active    === 1).length;
        const completedStudents  = afterPaymentFilter.filter(s => s.completed === 1).length;
        const inactiveStudents   = afterPaymentFilter.filter(s => s.active    === 0).length;
        const withReason         = afterPaymentFilter.filter(s => s.reason && s.reason.trim() !== "").length;
        const fullyPaidStudents  = afterPaymentFilter.filter(s => s.fullyPaid).length;
        const partialStudents    = afterPaymentFilter.filter(s => s.paidAmount > 0 && !s.fullyPaid).length;
        const unpaidStudents     = afterPaymentFilter.filter(s => s.paidAmount === 0 && s.expectedTotal > 0).length;
        const grandExpected      = afterPaymentFilter.reduce((sum, s) => sum + s.expectedTotal, 0);
        const grandPaid          = afterPaymentFilter.reduce((sum, s) => sum + s.paidAmount, 0);
        const grandRemaining     = afterPaymentFilter.reduce((sum, s) => sum + s.remainingAmount, 0);
        const overallPaymentPct  = grandExpected > 0 ? Math.round((grandPaid / grandExpected) * 100) : 0;

        // Хүйсээр
        const byGender = {};
        for (const s of afterPaymentFilter) {
            const g = s.gender || "Тодорхойгүй";
            byGender[g] = (byGender[g] || 0) + 1;
        }

        // Салбараар
        const byBranch = {};
        for (const s of afterPaymentFilter) {
            const b = s.branchName || "Тодорхойгүй";
            if (!byBranch[b]) byBranch[b] = { total:0, active:0, completed:0, inactive:0, expectedTotal:0, paidAmount:0, remainingAmount:0, fullyPaid:0 };
            byBranch[b].total          += 1;
            byBranch[b].active         += s.active    === 1 ? 1 : 0;
            byBranch[b].completed      += s.completed === 1 ? 1 : 0;
            byBranch[b].inactive       += s.active    === 0 ? 1 : 0;
            byBranch[b].expectedTotal  += s.expectedTotal;
            byBranch[b].paidAmount     += s.paidAmount;
            byBranch[b].remainingAmount+= s.remainingAmount;
            byBranch[b].fullyPaid      += s.fullyPaid ? 1 : 0;
        }

        // Ангилалаар
        const byCategory = {};
        for (const s of afterPaymentFilter) {
            const c = s.intakeCategoryName || s.categoryName || "Тодорхойгүй";
            if (!byCategory[c]) byCategory[c] = { total:0, active:0, completed:0, inactive:0, expectedTotal:0, paidAmount:0, remainingAmount:0, fullyPaid:0 };
            byCategory[c].total          += 1;
            byCategory[c].active         += s.active    === 1 ? 1 : 0;
            byCategory[c].completed      += s.completed === 1 ? 1 : 0;
            byCategory[c].inactive       += s.active    === 0 ? 1 : 0;
            byCategory[c].expectedTotal  += s.expectedTotal;
            byCategory[c].paidAmount     += s.paidAmount;
            byCategory[c].remainingAmount+= s.remainingAmount;
            byCategory[c].fullyPaid      += s.fullyPaid ? 1 : 0;
        }

        // Элсэлтээр
        const byIntake = {};
        for (const s of afterPaymentFilter) {
            const key = s.intakeName || "Элсэлтгүй";
            if (!byIntake[key]) byIntake[key] = { total:0, active:0, completed:0, inactive:0, expectedTotal:0, paidAmount:0, remainingAmount:0, fullyPaid:0 };
            byIntake[key].total          += 1;
            byIntake[key].active         += s.active    === 1 ? 1 : 0;
            byIntake[key].completed      += s.completed === 1 ? 1 : 0;
            byIntake[key].inactive       += s.active    === 0 ? 1 : 0;
            byIntake[key].expectedTotal  += s.expectedTotal;
            byIntake[key].paidAmount     += s.paidAmount;
            byIntake[key].remainingAmount+= s.remainingAmount;
            byIntake[key].fullyPaid      += s.fullyPaid ? 1 : 0;
        }

        // Сараар
        const byMonth = {};
        if (!targetMonth) {
            for (let m = 1; m <= 12; m++) {
                byMonth[m] = { month:m, total:0, active:0, completed:0, inactive:0, expectedTotal:0, paidAmount:0, fullyPaid:0 };
            }
            for (const s of afterPaymentFilter) {
                if (!s.date) continue;
                const m = new Date(s.date).getMonth() + 1;
                byMonth[m].total         += 1;
                byMonth[m].active        += s.active    === 1 ? 1 : 0;
                byMonth[m].completed     += s.completed === 1 ? 1 : 0;
                byMonth[m].inactive      += s.active    === 0 ? 1 : 0;
                byMonth[m].expectedTotal += s.expectedTotal;
                byMonth[m].paidAmount    += s.paidAmount;
                byMonth[m].fullyPaid     += s.fullyPaid ? 1 : 0;
            }
        }

        // Өдрөөр
        const byDay = {};
        if (targetMonth) {
            for (const s of afterPaymentFilter) {
                if (!s.date) continue;
                const d = new Date(s.date).getDate();
                if (!byDay[d]) byDay[d] = { day:d, total:0, active:0, completed:0, inactive:0, expectedTotal:0, paidAmount:0 };
                byDay[d].total         += 1;
                byDay[d].active        += s.active    === 1 ? 1 : 0;
                byDay[d].completed     += s.completed === 1 ? 1 : 0;
                byDay[d].inactive      += s.active    === 0 ? 1 : 0;
                byDay[d].expectedTotal += s.expectedTotal;
                byDay[d].paidAmount    += s.paidAmount;
            }
        }

        return res.status(200).json({
            success: true,
            data: {
                report: {
                    year:  targetYear, month: targetMonth,
                    dateFrom: dateFrom.toISOString(),
                    dateTo:   new Date(dateTo.getTime() - 1).toISOString(),
                    generatedAt: new Date().toISOString(),
                    appliedFilters: {
                        year: targetYear, month: targetMonth,
                        branch:    branch    ? parseInt(branch)    : null,
                        category:  category  ? parseInt(category)  : null,
                        intake:    intake    ? parseInt(intake)     : null,
                        active:    active    !== undefined && active    !== "" ? parseInt(active)    : null,
                        completed: completed !== undefined && completed !== "" ? parseInt(completed) : null,
                        paymentStatus: paymentStatus || null,
                    },
                },
                summary: {
                    totalStudents, activeStudents, completedStudents,
                    inactiveStudents, withReason,
                    // ── Төлбөр ──
                    fullyPaidStudents, partialStudents, unpaidStudents,
                    grandExpectedTotal:  grandExpected,
                    grandPaidAmount:     grandPaid,
                    grandRemainingAmount:grandRemaining,
                    overallPaymentPct,
                    // Хувь
                    activeRate:    totalStudents > 0 ? Math.round((activeStudents    / totalStudents) * 100) : 0,
                    completedRate: totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0,
                    inactiveRate:  totalStudents > 0 ? Math.round((inactiveStudents  / totalStudents) * 100) : 0,
                    fullyPaidRate: totalStudents > 0 ? Math.round((fullyPaidStudents / totalStudents) * 100) : 0,
                },
                byGender:   Object.entries(byGender).map(([name, count]) => ({ name, count })),
                byBranch:   Object.entries(byBranch).map(([name, d])     => ({ name, ...d })),
                byCategory: Object.entries(byCategory).map(([name, d])   => ({ name, ...d })),
                byIntake:   Object.entries(byIntake).map(([name, d])     => ({ name, ...d })),
                byMonth:    targetMonth ? [] : Object.values(byMonth),
                byDay:      targetMonth ? Object.values(byDay).sort((a,b) => a.day - b.day) : [],
                students:   afterPaymentFilter,
                pagination: {
                    total:      totalCount,
                    page:       page  ? parseInt(page)  : 1,
                    limit:      limit ? parseInt(limit) : totalCount,
                    totalPages: limit ? Math.ceil(totalCount / parseInt(limit)) : 1,
                },
            },
            message: "Амжилттай.",
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false, data: [],
            message: "Серверийн алдаа гарлаа. " + err,
        });
    }
};

module.exports = GET_REGISTER_REPORT;