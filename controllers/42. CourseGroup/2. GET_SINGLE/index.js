    const prismaService = require("../../../services/prismaService");

    const COURSE_GET_SINGLE_GROUP = async (req, res) => {
        try {
            const user = req.user;
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false, data: null,
                    message: 'Мэдээлэл буруу эсвэл дутуу байна.'
                });
            }

            const group = await prismaService.course_group.findFirst({
                where: {
                    id: parseInt(id),
                    course: parseInt(user?.course)
                },
                include: {
                    course_category: {
                        include: {
                            category_course_category_categoryTocategory: true
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
                }
            });

            console.log(group)

            if (!group) {
                return res.status(404).json({
                    success: false, data: null,
                    message: "Мэдээлэл устсан эсвэл байхгүй байна."
                });
            }

            const rawStudents = group.course_group_to_student_course_group_to_student_course_groupTocourse_group
    .map(rel => ({ ...rel.course_student, rowId: rel.id }))  
    .filter(Boolean);

            console.log(rawStudents)

            // ── STUDENT MAPPING ───────────────────────────────────────
            const students = rawStudents.map(s => {
                const cat = s.course_student_category?.[0];
                const expectedTotal  = parseFloat(cat?.payment || 0);
                const payments       = cat
                    ?.course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category
                    || [];
                const paidAmount     = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                const remainingAmount = Math.max(0, expectedTotal - paidAmount);
                const paymentPct     = expectedTotal > 0 ? Math.round((paidAmount / expectedTotal) * 100) : 0;

                const invoiceList = payments.map(p => ({
                    id:          p.id,
                    status:      p.status,
                    amount:      parseFloat(p.amount || 0),
                    description: p.description,
                    number:      p.number,
                    url:         p.url,
                    due_date:    p.due_date,
                    created_at:  p.created_at,
                    invoice_id:  p.invoice_id,
                }));

                return {
                    rowId: s.rowId,
                    id:           s.id,
                    kode:         s.kode,
                    familyname:   s.familyname,
                    firstname:    s.firstname,
                    lastname:     s.lastname,
                    register:     s.register,
                    phone:        s.phone,
                    gender:       s.gender,
                    birthdate:    s.birthdate,
                    date:         s.date,
                    active:       s.active,
                    completed:    s.completed,
                    reason:       s.reason,
                    location:     s.location,
                    categoryName: group.course_category
                        ?.category_course_category_categoryTocategory?.name ?? null,
                    expectedTotal,
                    paidAmount,
                    remainingAmount,
                    paymentPct,
                    invoiceList,
                    // Ирц (одоогоор хоосон — schedule/driving холбогдох үед нэмнэ)
                    scheduleStats: { attended: 0, notAttended: 0, notStarted: 0, notMarked: 0, total: 0, attendanceRate: 0 },
                    drivingStats:  { attended: 0, notAttended: 0, notStarted: 0, notMarked: 0, total: 0, attendanceRate: 0 },
                };
            });

            // ── STATS ─────────────────────────────────────────────────
            const totalStudents     = students.length;
            const activeStudents    = students.filter(s => s.active === 1).length;
            const inactiveStudents  = students.filter(s => s.active === 0).length;
            const completedStudents = students.filter(s => s.completed === 1).length;
            const fullyPaidStudents = students.filter(s => s.expectedTotal > 0 && s.remainingAmount === 0).length;
            const unpaidStudents    = students.filter(s => s.remainingAmount > 0).length;

            const grandExpectedTotal  = students.reduce((s, r) => s + r.expectedTotal,  0);
            const grandPaidAmount     = students.reduce((s, r) => s + r.paidAmount,     0);
            const grandRemainingAmount = students.reduce((s, r) => s + r.remainingAmount, 0);
            const paymentPct          = grandExpectedTotal > 0
                ? Math.round((grandPaidAmount / grandExpectedTotal) * 100) : 0;

            const capacity    = group.capacity || 0;
            const enrolled    = totalStudents;
            const capacityPct = capacity > 0 ? Math.round((enrolled / capacity) * 100) : 0;

            // ── TIMELINE ──────────────────────────────────────────────
            const startD = group.start_date ? new Date(group.start_date) : null;
            const endD   = group.end_date   ? new Date(group.end_date)   : null;
            const now    = new Date();
            let timeline  = {};

            if (startD && endD) {
                const totalDays   = Math.ceil((endD - startD) / 86400000);
                const elapsedDays = Math.max(0, Math.min(totalDays, Math.ceil((now - startD) / 86400000)));
                const progressPct = totalDays > 0 ? Math.round((elapsedDays / totalDays) * 100) : 0;
                const daysRemaining = Math.max(0, Math.ceil((endD - now) / 86400000));

                // Peak day
                const dayMap = {};
                students.forEach(s => {
                    if (!s.date) return;
                    const key = new Date(s.date).toISOString().split("T")[0];
                    dayMap[key] = (dayMap[key] || 0) + 1;
                });
                let peakDay = null;
                Object.entries(dayMap).forEach(([date, count]) => {
                    if (!peakDay || count > peakDay.count) peakDay = { date, count };
                });

                timeline = { totalDays, elapsedDays, progressPct, daysRemaining, peakDay };
            }

            // ── AGGREGATE ATTENDANCE (хоосон — холбогдох үед дүүргэнэ) ──
            const emptyAgg = {
                attended: 0, notAttended: 0, notStarted: 0,
                notMarked: 0, total: 0, attendanceRate: 0
            };

            // ── INTAKE OBJECT ─────────────────────────────────────────
            const intake = {
                id:           group.id,
                name:         group.name,
                capacity:     group.capacity,
                start_date:   group.start_date,
                end_date:     group.end_date,
                created_at:   group.created_at,
                active:       group.active ?? 1,
                branchName:   null, 
                categoryName: group.course_category
                    ?.category_course_category_categoryTocategory?.name ?? null,
            };

            return res.status(200).json({
                success: true,
                data: {
                    intake,
                    students,
                    stats: {
                        totalStudents,
                        activeStudents,
                        inactiveStudents,
                        completedStudents,
                        fullyPaidStudents,
                        unpaidStudents,
                        grandExpectedTotal,
                        grandPaidAmount,
                        grandRemainingAmount,
                        paymentPct,
                        capacity,
                        enrolled,
                        capacityPct,
                        timeline,
                        scheduleAggregate: emptyAgg,
                        drivingAggregate:  emptyAgg,
                    }
                },
                message: 'Амжилттай.'
            });

        } catch (err) {
            return res.status(500).json({
                success: false, data: null,
                message: 'Серверийн алдаа гарлаа.' + err
            });
        }
    };

    module.exports = COURSE_GET_SINGLE_GROUP;