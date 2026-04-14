const prismaService = require("../../../services/prismaService");

const ME_STUDENT_STATUS = async (req, res) => {
    try {
        const student = req.user;
        const studentId = parseInt(student?.id);

        const REQUIRED_THEORY_HOURS  = 76;
        const REQUIRED_DRIVING_HOURS = 20;

        /* ─────────────────────────────────────────
           1. Бүх өгөгдлийг зэрэг татах
        ───────────────────────────────────────── */
        const [theoryRecords, drivingRecords, exams, studentCategoryData] = await Promise.all([
            prismaService.course_student_schedule.findMany({
                where: { student: studentId, attendance: 1 },
                include: { schedule_course_student_schedule_scheduleToschedule: true }
            }),
            prismaService.course_student_driving_schedule.findMany({
                where: { student: studentId, attendance: 1 },
                include: {
                    driving_schedule_course_student_driving_schedule_driving_scheduleTodriving_schedule: true
                }
            }),
            prismaService.exam.findMany({
                where: { student: studentId, isMake: 1 },
                orderBy: { date: 'desc' },
                take: 10
            }),
            prismaService.course_student_category.findFirst({
                where: { student: studentId },
                include: { category_course_student_category_categoryTocategory: true }
            })
        ]);

        /* ─────────────────────────────────────────
           2. Онолын цаг тооцох
        ───────────────────────────────────────── */
        let theoryMinutes = 0;
        theoryRecords.forEach(record => {
            const sched = record.schedule_course_student_schedule_scheduleToschedule;
            if (sched?.start_time && sched?.end_time) {
                theoryMinutes += (new Date(sched.end_time) - new Date(sched.start_time)) / 60000;
            }
        });
        const theoryHours     = parseFloat((theoryMinutes / 60).toFixed(1));
        const theoryPercent   = Math.min(Math.round((theoryHours / REQUIRED_THEORY_HOURS) * 100), 100);
        const theoryRemaining = Math.max(parseFloat((REQUIRED_THEORY_HOURS - theoryHours).toFixed(1)), 0);

        /* ─────────────────────────────────────────
           3. Жолоодлогын цаг тооцох
        ───────────────────────────────────────── */
        let drivingMinutes = 0;
        drivingRecords.forEach(record => {
            const dSched =
                record.driving_schedule_course_student_driving_schedule_driving_scheduleTodriving_schedule;
            if (dSched?.start_time && dSched?.end_time) {
                drivingMinutes += (new Date(dSched.end_time) - new Date(dSched.start_time)) / 60000;
            }
        });
        const drivingHours     = parseFloat((drivingMinutes / 60).toFixed(1));
        const drivingPercent   = Math.min(Math.round((drivingHours / REQUIRED_DRIVING_HOURS) * 100), 100);
        const drivingRemaining = Math.max(parseFloat((REQUIRED_DRIVING_HOURS - drivingHours).toFixed(1)), 0);

        /* ─────────────────────────────────────────
           4. Шалгалтын дундаж
        ───────────────────────────────────────── */
        const examCount   = exams.length;
        const avgProgress = examCount > 0
            ? exams.reduce((sum, e) => sum + (e.progress ?? 0), 0) / examCount
            : 0;

        /* ─────────────────────────────────────────
           5. Topic явц тооцох
        ───────────────────────────────────────── */
        let topicStats = {
            total:       0,
            completed:   0,
            inProgress:  0,
            notStarted:  0,
            allCompleted: false,
            completedPercent: 0,
        };

        if (studentCategoryData) {
            const categoryId = studentCategoryData.category_course_student_category_categoryTocategory?.id;

            const [allTopics, studentTopicProgress] = await Promise.all([
                prismaService.topic.findMany({
                    where: { category: parseInt(categoryId) },
                    select: { id: true }
                }),
                prismaService.student_topic_progress.findMany({
                    where: { student: studentId },
                    orderBy: { progress: 'desc' }
                })
            ]);

            const progressMap = new Map();
            studentTopicProgress.forEach(p => {
                const existing = progressMap.get(p.topic);
                if (!existing || p.progress > existing.progress) {
                    progressMap.set(p.topic, {
                        progress:  p.progress  ?? 0,
                        completed: p.completed == 1 || p.completed === true, // 1 эсвэл true-г шалгана
                    });
                }
            });

            const total      = allTopics.length;
            const completed  = allTopics.filter(t => progressMap.get(t.id)?.completed).length;
            const inProgress = allTopics.filter(t => {
                const p = progressMap.get(t.id);
                return p && p.progress > 0 && !p.completed;
            }).length;
            const notStarted = total - completed - inProgress;

            topicStats = {
                total,
                completed,
                inProgress,
                notStarted,
                allCompleted:      total > 0 && completed === total,
                completedPercent:  total > 0 ? Math.round((completed / total) * 100) : 0,
            };
        }

        /* ─────────────────────────────────────────
           6. Нийт статус + overallProgress
        ───────────────────────────────────────── */
        const theoryUnlocked = theoryHours >= REQUIRED_THEORY_HOURS && avgProgress >= 90 && topicStats.allCompleted;
        const drivingUnlocked = drivingHours >= REQUIRED_DRIVING_HOURS && theoryUnlocked;

        const canRegisterForOfficialExam = theoryUnlocked && drivingHours >= REQUIRED_DRIVING_HOURS;

        const overallProgress = Math.round(
            (theoryPercent            * 0.35) +
            (drivingPercent           * 0.35) +
            (Math.min(avgProgress, 100) * 0.20) +
            (topicStats.completedPercent * 0.10)
        );

        return res.status(200).json({
            success: true,
            data: {
                theory: {
                    currentHours:   theoryHours,
                    requiredHours:  REQUIRED_THEORY_HOURS,
                    remainingHours: theoryRemaining,
                    percent:        theoryPercent,
                    isComplete:     theoryHours >= REQUIRED_THEORY_HOURS,
                },
                driving: {
                    currentHours:   drivingHours,
                    requiredHours:  REQUIRED_DRIVING_HOURS,
                    remainingHours: drivingRemaining,
                    percent:        drivingPercent,
                    isComplete:     drivingHours >= REQUIRED_DRIVING_HOURS,
                },
                exams: {
                    lastTenAvg:  parseFloat(avgProgress.toFixed(1)),
                    count:       examCount,
                    isExcellent: avgProgress >= 90,
                },
                topics: topicStats,
                overallProgress,
                canRegisterForOfficialExam,
                // Хүссэн хоёр утга чинь:
                theoryUnlocked,
                drivingUnlocked
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Алдаа гарлаа: ' + err.message
        });
    }
};

module.exports = ME_STUDENT_STATUS;
