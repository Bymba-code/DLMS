const prismaService = require("../../../services/prismaService");

const COURSE_GET_ALL_STUDENT_DEDU = async (req, res) => {
    try {
        const user = req.user;
        // Шүүлтүүрүүд: ?month=4&year=2026&status=ready (ready эсвэл not_ready)
        const { month, year, status } = req.query;

        const REQUIRED_THEORY_HOURS = 76;
        const REQUIRED_DRIVING_HOURS = 20;

        const allTopics = await prismaService.topic.findMany({
            select: { id: true, category: true }
        });

        const whereClause = { course: parseInt(user?.course) };
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);
            whereClause.date = { gte: startDate, lte: endDate };
        }

        const students = await prismaService.course_student.findMany({
            where: whereClause,
            include: {
                course_student_schedule: { where: { attendance: 1 }, include: { schedule_course_student_schedule_scheduleToschedule: true } },
                course_student_driving_schedule: { where: { attendance: 1 }, include: { driving_schedule_course_student_driving_schedule_driving_scheduleTodriving_schedule: true } },
                exam: { where: { isMake: 1 }, orderBy: { date: 'desc' }, take: 10 },
                course_student_category: { include: { category_course_student_category_categoryTocategory: true } },
                student_topic_progress: true
            }
        });

        let result = students.map(student => {
            let theoryMinutes = 0;
            student.course_student_schedule.forEach(r => {
                const s = r.schedule_course_student_schedule_scheduleToschedule;
                if (s?.start_time && s?.end_time) theoryMinutes += (new Date(s.end_time) - new Date(s.start_time)) / 60000;
            });
            const theoryHours = parseFloat((theoryMinutes / 60).toFixed(1));

            let drivingMinutes = 0;
            student.course_student_driving_schedule.forEach(r => {
                const s = r.driving_schedule_course_student_driving_schedule_driving_scheduleTodriving_schedule;
                if (s?.start_time && s?.end_time) drivingMinutes += (new Date(s.end_time) - new Date(s.start_time)) / 60000;
            });
            const drivingHours = parseFloat((drivingMinutes / 60).toFixed(1));

            const examCount = student.exam.length;
            const avgProgress = examCount > 0 ? student.exam.reduce((sum, e) => sum + (e.progress ?? 0), 0) / examCount : 0;

            const studentCategory = student.course_student_category?.[0]?.category;
            const categoryTopics = allTopics.filter(t => t.category === studentCategory);
            const totalTopicCount = categoryTopics.length;
            const completedTopicCount = student.student_topic_progress.filter(tp => {
                const isCorrectCategory = categoryTopics.some(ct => ct.id === tp.topic);
                return isCorrectCategory && tp.completed;
            }).length;

            const isAllTopicsComplete = totalTopicCount > 0 && completedTopicCount === totalTopicCount;
            
            // Бүх нөхцөл хангасан эсэх
            const isReady = theoryHours >= REQUIRED_THEORY_HOURS && 
                            drivingHours >= REQUIRED_DRIVING_HOURS && 
                            avgProgress >= 90 && 
                            isAllTopicsComplete;

            return {
                id: student.id,
                name: `${student.firstname.slice(0,1)}. ${student.lastname}`,
                kode:student?.kode,
                status: isReady ? 'ready' : 'not_ready', // Энд статус нэмлээ
                progress: {
                    theoryHours,
                    drivingHours,
                    avgProgress: parseFloat(avgProgress.toFixed(1)),
                    isAllTopicsComplete
                }
            };
        });

        // Хэрэв ?status= параметрээр шүүлт ирвэл шүүнэ
        if (status === 'ready' || status === 'not_ready') {
            result = result.filter(s => s.status === status);
        }

        return res.status(200).json({ success: true, count: result.length, data: result });

    } catch (err) {
        return res.status(500).json({ success: false, message: 'Алдаа: ' + err.message });
    }
};

module.exports = COURSE_GET_ALL_STUDENT_DEDU;