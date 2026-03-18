const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const STAT_COURSE = async (req, res) => {
    try 
    {
        const user = req.user;
        const { month } = req.query; 

        let startDate = null;
        let endDate   = null;
        
        if (month && month !== 'all') {
            const [year, monthNum] = month.split('-').map(Number);
            if (year && monthNum >= 1 && monthNum <= 12) {
                startDate = new Date(year, monthNum - 1, 1);
                endDate   = new Date(year, monthNum, 1);
            }
        }

        const dateFilter = startDate && endDate
            ? { created_at: { gte: startDate, lt: endDate } }
            : {};

        // ── Exams ───────────────────────────────────────────────────────
        const exams = await prismaService.exam.findMany({
            where: { course: parseInt(user.course) },
            include: {
                course_student: {
                    select: { id: true, firstname: true, lastname: true, kode: true, phone: true }
                },
                category_exam_categoryTocategory: {
                    select: { id: true, name: true }
                },
                exam_test_exam_test_examToexam: {
                    select: { id: true, isSuccess: true }
                }
            },
            orderBy: { date: "desc" }
        });

        // ── Students with payments ──────────────────────────────────────
        const students = await prismaService.course_student.findMany({
            where: { course: parseInt(user?.course) },
            include: {
                course_student_category: {
                    include: {
                        course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category: {
                            where: dateFilter
                        }
                    }
                }
            }
        });

        // ── Branches ────────────────────────────────────────────────────
        const branches = await prismaService.branches.findMany({
            where: { course: parseInt(user?.course) },
            include: {
                course_student: {
                    select: {
                        id:        true,
                        firstname: true,
                        lastname:  true,
                        kode:      true,
                        phone:     true,
                        date:      true,
                        course_student_category: {
                            select: {
                                payment: true,
                                course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category: {
                                    where: dateFilter,
                                    select: { status: true, amount: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        // ── System rental invoices ──────────────────────────────────────
        const systemRentalWhere = {
            course:  parseInt(user?.course),
            status:  "paid",
            ...(startDate && endDate && { created_at: { gte: startDate, lt: endDate } })
        };
        const systemRentalInvoice = await prismaService.course_system_rental.findMany({
            where: systemRentalWhere
        });

        // ── Limit invoices ──────────────────────────────────────────────
        const limitBoughtWhere = {
            course:  parseInt(user?.course),
            status:  "paid",
            ...(startDate && endDate && { created_at: { gte: startDate, lt: endDate } })
        };
        const limitBoughtInvoices = await prismaService.course_limit_invoice.findMany({
            where: limitBoughtWhere
        });

        const allLimitInvoices = await prismaService.course_limit_invoice.findMany({
            where: { course: parseInt(user?.course), status: "paid" }
        });

        // ── System rental calculations ──────────────────────────────────
        const now = new Date();
        let systemRentalExpenses = 0;
        const activeRentals  = [];
        const expiredRentals = [];

        systemRentalInvoice.forEach(inv => {
            systemRentalExpenses += parseFloat(inv.amount) || 0;
            const s = new Date(inv.start_date), e = new Date(inv.end_date);
            if (s <= now && e >= now) activeRentals.push(inv);
            else                      expiredRentals.push(inv);
        });

        const latestActiveRental = activeRentals
            .sort((a, b) => new Date(b.end_date) - new Date(a.end_date))[0] || null;

        // ── Limit calculations ──────────────────────────────────────────
        let limitExpenses      = 0;
        let totalLimitsBought  = 0;
        limitBoughtInvoices.forEach(inv => {
            limitExpenses     += parseFloat(inv.amount) || 0;
            totalLimitsBought += parseInt(inv.limit)   || 0;
        });

        let allTotalLimitsBought = 0;
        allLimitInvoices.forEach(inv => { allTotalLimitsBought += parseInt(inv.limit) || 0; });

        // ── Payment statistics ──────────────────────────────────────────
        let totalAmount        = 0;
        let paidAmount         = 0;
        let totalInvoices      = 0;
        let paidInvoices       = 0;
        let unpaidInvoices     = 0;
        let cancelledInvoices  = 0;
        const allPaidInvoicesRaw = [];

        students.forEach(student => {
            student.course_student_category.forEach(cat => {
                const payments = cat
                    .course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category
                    || [];

                if (startDate && endDate) {
                    payments.forEach(p => {
                        totalInvoices++;
                        const amt = parseFloat(p.amount) || 0;
                        totalAmount += amt;
                        if (p.status === 'paid') {
                            paidAmount += amt;
                            paidInvoices++;
                            allPaidInvoicesRaw.push({
                                ...p,
                                studentName: `${student.lastname} ${student.firstname}`,
                                studentId:   student.id,
                                phone:       student.phone,
                            });
                        } else if (p.status === 'cancelled') {
                            cancelledInvoices++;
                        } else if (p.status === 'open') {
                            unpaidInvoices++;
                        }
                    });
                } else {
                    totalAmount += parseFloat(cat.payment) || 0;
                    payments.forEach(p => {
                        totalInvoices++;
                        const amt = parseFloat(p.amount) || 0;
                        if (p.status === 'paid') {
                            paidAmount += amt;
                            paidInvoices++;
                            allPaidInvoicesRaw.push({
                                ...p,
                                studentName: `${student.lastname} ${student.firstname}`,
                                studentId:   student.id,
                                phone:       student.phone,
                            });
                        } else if (p.status === 'cancelled') {
                            cancelledInvoices++;
                        } else if (p.status === 'open') {
                            unpaidInvoices++;
                        }
                    });
                }
            });
        });

        // ── Last 10 paid invoices ───────────────────────────────────────
        const lastTenPaidInvoices = allPaidInvoicesRaw
            .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
            .slice(0, 10);

        // ── Students with debt ──────────────────────────────────────────
        const studentsWithDebt = [];

        students.forEach(student => {
            let studentTotal = 0;
            let studentPaid  = 0;

            student.course_student_category.forEach(cat => {
                const payments = cat
                    .course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category
                    || [];

                if (startDate && endDate) {
                    payments.forEach(p => {
                        const amt = parseFloat(p.amount) || 0;
                        studentTotal += amt;
                        if (p.status === 'paid') studentPaid += amt;
                    });
                } else {
                    studentTotal += parseFloat(cat.payment) || 0;
                    payments.forEach(p => {
                        if (p.status === 'paid') studentPaid += parseFloat(p.amount) || 0;
                    });
                }
            });

            const remaining = studentTotal - studentPaid;
            if (remaining > 0) {
                studentsWithDebt.push({
                    id:              student.id,
                    studentName:     `${student.lastname} ${student.firstname}`,
                    familyname:      student.familyname,
                    firstname:       student.firstname,
                    lastname:        student.lastname,
                    phone:           student.phone,
                    totalAmount:     studentTotal,
                    paidAmount:      studentPaid,
                    remainingAmount: remaining,
                    paymentProgress: studentTotal > 0
                        ? Math.round((studentPaid / studentTotal) * 100)
                        : 0
                });
            }
        });

        studentsWithDebt.sort((a, b) => b.remainingAmount - a.remainingAmount);

        // ── Last 10 exams ───────────────────────────────────────────────
        const lastTenExams = exams.slice(0, 10).map(e => {
            const tests        = e.exam_test_exam_test_examToexam || [];
            const totalTests   = tests.length;
            const correctTests = tests.filter(t => t.isSuccess === 1).length;
            const progressPct  = e.progress != null
                ? Math.round(e.progress)
                : totalTests > 0 ? Math.round((correctTests / totalTests) * 100) : 0;
            const s = e.course_student;
            return {
                id:           e.id,
                studentName:  s ? `${s.lastname || ""} ${s.firstname || ""}`.trim() || "—" : "—",
                studentId:    e.student,
                studentKode:  s?.kode  || null,
                studentPhone: s?.phone || null,
                categoryName: e.category_exam_categoryTocategory?.name || "Ангилал байхгүй",
                progress:     progressPct,
                isMake:       e.isMake,
                success:      e.success  ?? correctTests,
                wrong:        e.wrong    ?? (totalTests - correctTests),
                totalTests,
                createdAt:    e.date,
                endDate:      e.end_date,
            };
        });

        // ── Branch statistics ───────────────────────────────────────────
        const branchStats = branches.map(branch => {
            const branchStudents = branch.course_student || [];
            let branchTotal = 0, branchPaid = 0;

            branchStudents.forEach(st => {
                (st.course_student_category || []).forEach(cat => {
                    const payments = cat
                        .course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category
                        || [];
                    if (startDate && endDate) {
                        payments.forEach(p => {
                            const amt = parseFloat(p.amount) || 0;
                            branchTotal += amt;
                            if (p.status === 'paid') branchPaid += amt;
                        });
                    } else {
                        branchTotal += parseFloat(cat.payment) || 0;
                        payments.forEach(p => {
                            if (p.status === 'paid') branchPaid += parseFloat(p.amount) || 0;
                        });
                    }
                });
            });

            const recentStudents = branchStudents
                .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
                .slice(0, 3)
                .map(s => ({
                    id:    s.id,
                    name:  `${s.lastname || ""} ${s.firstname || ""}`.trim() || "—",
                    kode:  s.kode,
                    phone: s.phone,
                    date:  s.date,
                }));

            return {
                id:              branch.id,
                name:            branch.name     || "Нэргүй салбар",
                code:            branch.code     || null,
                phone:           branch.phone    || null,
                email:           branch.email    || null,
                location:        branch.location || null,
                active:          branch.active,
                studentCount:    branchStudents.length,
                totalAmount:     branchTotal,
                paidAmount:      branchPaid,
                remainingAmount: branchTotal - branchPaid,
                paymentPct:      branchTotal > 0
                    ? Math.round((branchPaid / branchTotal) * 100) : 0,
                recentStudents,
            };
        });

        branchStats.sort((a, b) => b.studentCount - a.studentCount);

        // ── Calculations ────────────────────────────────────────────────
        const remainingAmount   = totalAmount - paidAmount;
        const paymentPercentage = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;
        const totalExpenses     = systemRentalExpenses + limitExpenses;
        const netProfit         = paidAmount - totalExpenses;
        const profitMargin      = paidAmount > 0 ? Math.round((netProfit / paidAmount) * 100) : 0;
        const totalStudentsReg  = students.length;
        const remainingLimit    = allTotalLimitsBought - totalStudentsReg;
        const limitUsagePct     = allTotalLimitsBought > 0
            ? Math.round((totalStudentsReg / allTotalLimitsBought) * 100) : 0;

        // ── Response ────────────────────────────────────────────────────
        const statistics = {
            totalStudents: totalStudentsReg,
            filterPeriod: startDate && endDate
                ? { month, startDate, endDate }
                : { month: 'all', message: 'Бүх цаг үеийн өгөгдөл' },

            studentLimit: {
                totalLimitsBought:       allTotalLimitsBought,
                totalStudentsRegistered: totalStudentsReg,
                remainingLimit,
                limitUsagePercentage:    limitUsagePct,
                canRegisterMore:         remainingLimit > 0,
            },

            revenue: {
                totalAmount,
                paidAmount,
                remainingAmount,
                paymentPercentage,
            },

            expenses: {
                totalExpenses,
                systemRentalExpenses,
                limitExpenses,
                totalLimitsBought,
                totalSystemRentalCount:   systemRentalInvoice.length,
                activeSystemRentalCount:  activeRentals.length,
                expiredSystemRentalCount: expiredRentals.length,
                limitInvoicesCount:       limitBoughtInvoices.length,
            },

            activeSystemRental: latestActiveRental
                ? {
                    id:            latestActiveRental.id,
                    startDate:     latestActiveRental.start_date,
                    endDate:       latestActiveRental.end_date,
                    amount:        parseFloat(latestActiveRental.amount) || 0,
                    number:        latestActiveRental.number,
                    daysRemaining: Math.ceil(
                        (new Date(latestActiveRental.end_date) - now) / (1000 * 60 * 60 * 24)
                    ),
                    isActive: true,
                }
                : { isActive: false, message: "Идэвхтэй систем байхгүй" },

            profit: { netProfit, profitMargin },

            invoices: {
                total:     totalInvoices,
                paid:      paidInvoices,
                unpaid:    unpaidInvoices,
                cancelled: cancelledInvoices,
            },

            lastTenExams,
            lastTenPaidInvoices,
            studentsWithDebt,

            // ← Салбарын статистик
            branchStats,
        };

        return res.status(200).json({
            success:    true,
            statistics,
            message:    "Амжилттай."
        });
    }
    catch(err)
    {
        console.error("Statistics calculation error:", err);
        return res.status(500).json({
            success: false,
            data:    [],
            message: 'Серверийн алдаа гарлаа: ' + err.message
        });
    }
};

module.exports = STAT_COURSE;