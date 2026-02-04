const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const STUDENT_GET_STAT = async (req, res) => {
    try 
    {
        const student = req.user;

        const studentData = await prismaService.course_student_category.findFirst({
            where: {
                student: parseInt(student.id)
            },
            include: {
                category_course_student_category_categoryTocategory: true
            }
        });

        // Оюутны шалгалтуудыг авах
        const exams = await prismaService.exam.findMany({
            where: {
                student: parseInt(student?.id)
            },
            select: {
                id: true,
                course: true,
                student: true,
                category: true,
                isMake: true,
                progress: true,
                success: true,
                wrong: true,
                end_date: true,
                date: true
            },
            orderBy: {
                date: 'desc'
            }
        });

        // Оюутны ангиллын сэдвүүдийг авах
        const topics = await prismaService.topic.findMany({
            where: {
                category: parseInt(studentData.category_course_student_category_categoryTocategory?.id)
            },
            select: {
                id: true,
                name: true,
                category: true,
                date: true
            }
        });

        console.log(topics)

        // Оюутны сэдвүүдийн явцыг авах
        const studentTopicProgress = await prismaService.student_topic_progress.findMany({
            where: {
                student: parseInt(student?.id)
            },
            select: {
                id: true,
                topic: true,
                student: true,
                progress: true,
                completed: true,
                date: true
            }
        });
        
        // Оюутны бүх танхимийн хуваарийг авах
        const schedules = await prismaService.course_student_schedule.findMany({
            where: {
                student: parseInt(student?.id)
            },
            select: {
                id: true,
                student: true,
                schedule: true,
                attendance: true,
                note: true,
                date: true,
                updated_at: true
            }
        });

        // Оюутны жолоодлогын хуваарийг авах
        const drivingSchedules = await prismaService.course_student_driving_schedule.findMany({
            where: {
                student: parseInt(student?.id)
            },
            select: {
                id: true,
                student: true,
                driving_schedule: true,
                attendance: true,
                note: true,
                date: true,
                update_date: true
            }
        });

        // Танхимийн хуваарийн статистик тооцоолох
        const scheduleStats = {
            total: schedules.length,
            notMarked: schedules.filter(s => s.attendance === 0).length,
            attended: schedules.filter(s => s.attendance === 1).length,
            notAttended: schedules.filter(s => s.attendance === 2).length
        };

        scheduleStats.attendanceRate = scheduleStats.total > 0 
            ? Math.round((scheduleStats.attended / scheduleStats.total) * 100) 
            : 0;

        const markedSchedules = schedules.filter(s => s.attendance !== 0).length;
        scheduleStats.scheduleProgress = scheduleStats.total > 0
            ? Math.round((markedSchedules / scheduleStats.total) * 100)
            : 0;

        // Жолоодлогын хуваарийн статистик тооцоолох
        const drivingStats = {
            total: drivingSchedules.length,
            notMarked: drivingSchedules.filter(s => s.attendance === 0).length,
            attended: drivingSchedules.filter(s => s.attendance === 1).length,
            notAttended: drivingSchedules.filter(s => s.attendance === 2).length
        };

        drivingStats.attendanceRate = drivingStats.total > 0 
            ? Math.round((drivingStats.attended / drivingStats.total) * 100) 
            : 0;

        const markedDrivingSchedules = drivingSchedules.filter(s => s.attendance !== 0).length;
        drivingStats.scheduleProgress = drivingStats.total > 0
            ? Math.round((markedDrivingSchedules / drivingStats.total) * 100)
            : 0;

        // TopicProgress статистик тооцоолох
        const topicStats = {
            totalTopics: topics.length,
            startedTopics: 0,
            completedTopics: 0,
            notStartedTopics: 0,
            averageProgress: 0,
            totalProgress: 0
        };

        const topicProgressMap = new Map();
        
        studentTopicProgress.forEach(progress => {
            if (!topicProgressMap.has(progress.topic)) {
                topicProgressMap.set(progress.topic, {
                    maxProgress: progress.progress,
                    isCompleted: progress.completed === 1,
                    attempts: 1
                });
            } else {
                const existing = topicProgressMap.get(progress.topic);
                topicProgressMap.set(progress.topic, {
                    maxProgress: Math.max(existing.maxProgress, progress.progress),
                    isCompleted: existing.isCompleted || progress.completed === 1,
                    attempts: existing.attempts + 1
                });
            }
        });

        topics.forEach(topic => {
            const progressData = topicProgressMap.get(topic.id);
            
            if (!progressData) {
                topicStats.notStartedTopics++;
            } else {
                topicStats.startedTopics++;
                topicStats.totalProgress += progressData.maxProgress;
                
                if (progressData.isCompleted) {
                    topicStats.completedTopics++;
                }
            }
        });

        topicStats.averageProgress = topicStats.totalTopics > 0
            ? Math.round(topicStats.totalProgress / topicStats.totalTopics)
            : 0;

        topicStats.completionRate = topicStats.totalTopics > 0
            ? Math.round((topicStats.completedTopics / topicStats.totalTopics) * 100)
            : 0;

        topicStats.startedRate = topicStats.totalTopics > 0
            ? Math.round((topicStats.startedTopics / topicStats.totalTopics) * 100)
            : 0;

        const topicDetails = {
            completedTopicsList: [],
            inProgressTopicsList: [],
            notStartedTopicsList: []
        };

        topics.forEach(topic => {
            const progressData = topicProgressMap.get(topic.id);
            
            if (!progressData) {
                topicDetails.notStartedTopicsList.push({
                    id: topic.id,
                    name: topic.name,
                    progress: 0
                });
            } else if (progressData.isCompleted) {
                topicDetails.completedTopicsList.push({
                    id: topic.id,
                    name: topic.name,
                    progress: progressData.maxProgress,
                    attempts: progressData.attempts
                });
            } else {
                topicDetails.inProgressTopicsList.push({
                    id: topic.id,
                    name: topic.name,
                    progress: progressData.maxProgress,
                    attempts: progressData.attempts
                });
            }
        });

        // Exam статистик тооцоолох
        const examStats = {
            totalExams: exams.length,
            completedExams: exams.filter(e => e.isMake === 1).length,
            notCompletedExams: exams.filter(e => e.isMake === 0).length,
            averageProgress: 0,
            averageSuccess: 0,
            averageWrong: 0,
            totalProgress: 0,
            totalSuccess: 0,
            totalWrong: 0
        };

        // Дуусгасан шалгалтуудын статистик
        const completedExams = exams.filter(e => e.isMake === 1 && e.progress !== null);
        
        if (completedExams.length > 0) {
            completedExams.forEach(exam => {
                examStats.totalProgress += exam.progress || 0;
                examStats.totalSuccess += exam.success || 0;
                examStats.totalWrong += exam.wrong || 0;
            });

            examStats.averageProgress = Math.round(examStats.totalProgress / completedExams.length);
            examStats.averageSuccess = Math.round(examStats.totalSuccess / completedExams.length);
            examStats.averageWrong = Math.round(examStats.totalWrong / completedExams.length);
        }

        // Дуусгасан шалгалтын хувь
        examStats.completionRate = examStats.totalExams > 0
            ? Math.round((examStats.completedExams / examStats.totalExams) * 100)
            : 0;

        // Сүүлийн 3 шалгалт
        const lastThreeExams = exams.slice(0, 3).map(exam => ({
            id: exam.id,
            category: exam.category,
            isMake: exam.isMake,
            progress: exam.progress,
            success: exam.success,
            wrong: exam.wrong,
            date: exam.date,
            end_date: exam.end_date,
            status: exam.isMake === 1 ? 'Дууссан' : 'Дуусаагүй'
        }));

        // Response буцаах
        return res.status(200).json({
            success: true,
            data: {
                // Танхимийн хуваарийн статистик
                scheduleStats: {
                    total: scheduleStats.total,
                    notMarked: scheduleStats.notMarked,
                    attended: scheduleStats.attended,
                    notAttended: scheduleStats.notAttended,
                    attendanceRate: scheduleStats.attendanceRate,
                    scheduleProgress: scheduleStats.scheduleProgress
                },
                scheduleDetails: {
                    notMarkedList: schedules.filter(s => s.attendance === 0).map(s => s.id),
                    attendedList: schedules.filter(s => s.attendance === 1).map(s => s.id),
                    notAttendedList: schedules.filter(s => s.attendance === 2).map(s => s.id)
                },
                // Жолоодлогын хуваарийн статистик
                drivingStats: {
                    total: drivingStats.total,
                    notMarked: drivingStats.notMarked,
                    attended: drivingStats.attended,
                    notAttended: drivingStats.notAttended,
                    attendanceRate: drivingStats.attendanceRate,
                    scheduleProgress: drivingStats.scheduleProgress
                },
                drivingDetails: {
                    notMarkedList: drivingSchedules.filter(s => s.attendance === 0).map(s => s.id),
                    attendedList: drivingSchedules.filter(s => s.attendance === 1).map(s => s.id),
                    notAttendedList: drivingSchedules.filter(s => s.attendance === 2).map(s => s.id)
                },
                // Сэдвийн явцын статистик
                topicStats: {
                    totalTopics: topicStats.totalTopics,
                    startedTopics: topicStats.startedTopics,
                    completedTopics: topicStats.completedTopics,
                    notStartedTopics: topicStats.notStartedTopics,
                    averageProgress: topicStats.averageProgress,
                    completionRate: topicStats.completionRate,
                    startedRate: topicStats.startedRate
                },
                topicDetails: topicDetails,
                // Шалгалтын статистик
                examStats: {
                    totalExams: examStats.totalExams,
                    completedExams: examStats.completedExams,
                    notCompletedExams: examStats.notCompletedExams,
                    completionRate: examStats.completionRate,
                    averageProgress: examStats.averageProgress,
                    averageSuccess: examStats.averageSuccess,
                    averageWrong: examStats.averageWrong
                },
                lastThreeExams: lastThreeExams
            },
            message: 'Статистик амжилттай татагдлаа.'
        });

    } 
    catch(err) 
    {
        console.error('Статистик татахад алдаа:', err);
        return res.status(500).json({
            success: false,
            data: null,
            message: 'Серверийн алдаа гарлаа: ' + err.message
        });
    }
};

module.exports = STUDENT_GET_STAT;