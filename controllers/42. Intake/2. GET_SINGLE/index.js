const prismaService = require("../../../services/prismaService");

const GET_SINGLE_COURSE_INTAKE = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Мэдээлэл буруу эсвэл дутуу байна.",
            });
        }

        // ── 1. Элсэлтийн үндсэн мэдээлэл ──
        const intake = await prismaService.course_intake.findUnique({
            where: { id: parseInt(id) },
            include: {
                course_category_course_intake_course_categoryTocourse_category: {
                    include: { category_course_category_categoryTocategory: true },
                },
                branches: true,
                _count: { select: { course_student: true } },
            },
        });

        if (!intake) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "Мэдээлэл устсан эсвэл байхгүй байна.",
            });
        }

        // ── 2. Суралцагчдийн жагсаалт + төлбөр + ирц ──
        const students = await prismaService.course_student.findMany({
            where: {
                intake: parseInt(id),
                course: parseInt(user?.course),
            },
            include: {
                branches: true,
                course_student_category: {
                    include: {
                        category_course_student_category_categoryTocategory: true,
                        course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category: true,
                    },
                },
                course_student_schedule: {
                    include: {
                        schedule_course_student_schedule_scheduleToschedule: true,
                    },
                },
                course_student_driving_schedule: {
                    include: {
                        driving_schedule_course_student_driving_schedule_driving_scheduleTodriving_schedule: true,
                    },
                },
            },
            orderBy: { id: "desc" },
        });

        const now = new Date();

        // ── 3. Суралцагч тус бүрийн тооцоо ──
        const studentsWithPayment = students.map((s) => {
            let expectedTotal = 0;
            let invoiceTotal  = 0;
            let paidAmount    = 0;
            let totalInvoices = 0;
            let paidInvoices  = 0;

            // Нэхэмжлэлийн дэлгэрэнгүй жагсаалт
            const invoiceList = [];

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
                    }
                    // Нэхэмжлэлийн дэлгэрэнгүй мэдээлэл
                    invoiceList.push({
                        id:          p.id,
                        amount:      amt,
                        status:      p.status,
                        number:      p.number   ?? null,
                        description: p.description ?? null,
                        created_at:  p.created_at  ?? null,
                        updated_at:  p.updated_at  ?? null,
                        due_date:    p.due_date    ?? null,
                    });
                }
            }

            // Огноогоор эрэмбэлнэ — хамгийн сүүлийн дээр
            invoiceList.sort((a, b) =>
                new Date(b.created_at || 0) - new Date(a.created_at || 0)
            );

            const remainingAmount = Math.max(0, expectedTotal - paidAmount);
            const categoryName =
                s.course_student_category?.[0]
                    ?.category_course_student_category_categoryTocategory?.name ?? null;

            // Танхимийн ирц
            const schedRecords     = s.course_student_schedule || [];
            const schedTotal       = schedRecords.length;
            const schedAttended    = schedRecords.filter(r => r.attendance === 1).length;
            const schedNotAttended = schedRecords.filter(r => r.attendance === 2).length;
            const schedNotMarked   = schedRecords.filter(r =>
                r.attendance === 0 || r.attendance === null).length;
            const schedNotStarted  = schedRecords.filter(r => {
                const d = r.schedule_course_student_schedule_scheduleToschedule?.schedule_date;
                return d && new Date(d) > now;
            }).length;

            // Жолоодлогын ирц
            const drivRecords     = s.course_student_driving_schedule || [];
            const drivTotal       = drivRecords.length;
            const drivAttended    = drivRecords.filter(r => r.attendance === 1).length;
            const drivNotAttended = drivRecords.filter(r => r.attendance === 2).length;
            const drivNotMarked   = drivRecords.filter(r =>
                r.attendance === 0 || r.attendance === null).length;
            const drivNotStarted  = drivRecords.filter(r => {
                const d = r.driving_schedule_course_student_driving_schedule_driving_scheduleTodriving_schedule?.schedule_date;
                return d && new Date(d) > now;
            }).length;

            return {
                id:             s.id,
                kode:           s.kode,
                familyname:     s.familyname,
                firstname:      s.firstname,
                lastname:       s.lastname,
                phone:          s.phone,
                register:       s.register,
                active:         s.active,
                completed:      s.completed,
                reason:         s.reason ?? null,   // ← шинэ: идэвхгүй болсон шалтгаан
                date:           s.date,
                branchName:     s.branches?.name ?? null,
                categoryName,
                expectedTotal,
                invoiceTotal,
                paidAmount,
                remainingAmount,
                totalInvoices,
                paidInvoices,
                invoiceList,                          // ← шинэ: нэхэмжлэлийн дэлгэрэнгүй
                paymentPct: expectedTotal > 0
                    ? Math.round((paidAmount / expectedTotal) * 100) : 0,
                scheduleStats: {
                    total: schedTotal, attended: schedAttended,
                    notAttended: schedNotAttended, notMarked: schedNotMarked,
                    notStarted: schedNotStarted,
                    attendanceRate: schedTotal > 0
                        ? Math.round((schedAttended / schedTotal) * 100) : 0,
                },
                drivingStats: {
                    total: drivTotal, attended: drivAttended,
                    notAttended: drivNotAttended, notMarked: drivNotMarked,
                    notStarted: drivNotStarted,
                    attendanceRate: drivTotal > 0
                        ? Math.round((drivAttended / drivTotal) * 100) : 0,
                },
            };
        });

        // ── 4. Нийт тоймлол ──
        const totalStudents     = studentsWithPayment.length;
        const activeStudents    = studentsWithPayment.filter(s => s.active === 1).length;
        const completedStudents = studentsWithPayment.filter(s => s.completed === 1).length;
        const fullyPaid         = studentsWithPayment.filter(s =>
            s.expectedTotal > 0 && s.remainingAmount === 0).length;

        const grandExpectedTotal   = studentsWithPayment.reduce((a, s) => a + s.expectedTotal,   0);
        const grandInvoiceTotal    = studentsWithPayment.reduce((a, s) => a + s.invoiceTotal,    0);
        const grandPaidAmount      = studentsWithPayment.reduce((a, s) => a + s.paidAmount,      0);
        const grandRemainingAmount = studentsWithPayment.reduce((a, s) => a + s.remainingAmount, 0);

        const paymentPct = grandExpectedTotal > 0
            ? Math.round((grandPaidAmount / grandExpectedTotal) * 100) : 0;

        // ── 5. Нийт ирцийн тоймлол ──
        const scheduleAggregate = {
            total:       studentsWithPayment.reduce((a, s) => a + s.scheduleStats.total,       0),
            attended:    studentsWithPayment.reduce((a, s) => a + s.scheduleStats.attended,    0),
            notAttended: studentsWithPayment.reduce((a, s) => a + s.scheduleStats.notAttended, 0),
            notMarked:   studentsWithPayment.reduce((a, s) => a + s.scheduleStats.notMarked,   0),
            notStarted:  studentsWithPayment.reduce((a, s) => a + s.scheduleStats.notStarted,  0),
        };
        scheduleAggregate.attendanceRate = scheduleAggregate.total > 0
            ? Math.round((scheduleAggregate.attended / scheduleAggregate.total) * 100) : 0;

        const drivingAggregate = {
            total:       studentsWithPayment.reduce((a, s) => a + s.drivingStats.total,       0),
            attended:    studentsWithPayment.reduce((a, s) => a + s.drivingStats.attended,    0),
            notAttended: studentsWithPayment.reduce((a, s) => a + s.drivingStats.notAttended, 0),
            notMarked:   studentsWithPayment.reduce((a, s) => a + s.drivingStats.notMarked,   0),
            notStarted:  studentsWithPayment.reduce((a, s) => a + s.drivingStats.notStarted,  0),
        };
        drivingAggregate.attendanceRate = drivingAggregate.total > 0
            ? Math.round((drivingAggregate.attended / drivingAggregate.total) * 100) : 0;

        // ── 6. Нийт төлбөр хүлээн авсан бүртгэл (intake-ийн хэмжээнд) ──
        const allPaidInvoices = studentsWithPayment
            .flatMap(s => (s.invoiceList || [])
                .filter(inv => inv.status === "paid")
                .map(inv => ({
                    ...inv,
                    studentId:   s.id,
                    studentKode: s.kode,
                    studentName: `${s.firstname ?? ""} ${s.lastname ?? ""}`.trim(),
                }))
            )
            .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

        // ── 7. Хугацааны статистик ──
        const startDate = intake.start_date ? new Date(intake.start_date) : null;
        const endDate   = intake.end_date   ? new Date(intake.end_date)   : null;

        const totalDays    = (startDate && endDate)
            ? Math.max(0, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))) : 0;
        const elapsedDays  = startDate
            ? Math.max(0, Math.min(totalDays, Math.ceil((now - startDate) / (1000 * 60 * 60 * 24)))) : 0;
        const daysRemaining = endDate
            ? Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))) : null;
        const progressPct  = totalDays > 0 ? Math.round((elapsedDays / totalDays) * 100) : 0;

        const enrollmentsByMonth = {};
        const enrollmentsByDay   = {};
        for (const s of students) {
            if (!s.date) continue;
            const dt  = new Date(s.date);
            const mk  = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}`;
            const dk  = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`;
            enrollmentsByMonth[mk] = (enrollmentsByMonth[mk] || 0) + 1;
            enrollmentsByDay[dk]   = (enrollmentsByDay[dk]   || 0) + 1;
        }
        const peakDay = Object.entries(enrollmentsByDay)
            .sort((a, b) => b[1] - a[1])[0] ?? null;

        // ── 8. Capacity ──
        const enrolled    = intake._count?.course_student ?? 0;
        const capacity    = intake.capacity ?? 0;
        const capacityPct = capacity > 0 ? Math.round((enrolled / capacity) * 100) : 0;

        // ── 9. Ангилалын нэр ──
        const categoryName =
            intake.course_category_course_intake_course_categoryTocourse_category
                ?.category_course_category_categoryTocategory?.name ?? null;

        return res.status(200).json({
            success: true,
            data: {
                intake: {
                    id:         intake.id,
                    name:       intake.name,
                    capacity,
                    enrolled,
                    capacityPct,
                    active:     intake.active,
                    start_date: intake.start_date,
                    end_date:   intake.end_date,
                    created_at: intake.created_at,
                    branchName: intake.branches?.name ?? null,
                    categoryName,
                },
                stats: {
                    totalStudents,
                    activeStudents,
                    completedStudents,
                    inactiveStudents:    totalStudents - activeStudents,
                    studentsWithReason:  studentsWithPayment.filter(s => s.reason).length,
                    fullyPaidStudents:   fullyPaid,
                    unpaidStudents:      studentsWithPayment.filter(s => s.remainingAmount > 0).length,
                    grandExpectedTotal,
                    grandInvoiceTotal,
                    grandPaidAmount,
                    grandRemainingAmount,
                    paymentPct,
                    capacityPct,
                    enrolled,
                    capacity,
                    scheduleAggregate,
                    drivingAggregate,
                    timeline: {
                        totalDays, elapsedDays, daysRemaining, progressPct,
                        enrollmentsByMonth, enrollmentsByDay,
                        peakDay: peakDay ? { date: peakDay[0], count: peakDay[1] } : null,
                    },
                },
                // Intake-д хийсэн бүх төлсөн нэхэмжлэлүүд
                allPaidInvoices,
                students: studentsWithPayment,
            },
            message: "Амжилттай.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Серверийн алдаа гарлаа. " + err,
        });
    }
};

module.exports = GET_SINGLE_COURSE_INTAKE;