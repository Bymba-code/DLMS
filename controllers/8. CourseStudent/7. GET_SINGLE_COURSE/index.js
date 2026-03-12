const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const COURSE_STUDENT_GET_STAT = async (req, res) => {
    try 
    {
        const { id } = req.params;

        const student = await prismaService.course_student.findUnique({
            where: {
                id: parseInt(id)
            },
            include:{
                course_student_access:true,
                course_student_details:true
            }
        });

        const studentData = await prismaService.course_student_category.findFirst({
            where: {
                student: parseInt(id)
            },
            include: {
                category_course_student_category_categoryTocategory: true,
                course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category: true,
            }
        });

        let paymentStats = {
            totalAmount: 0,
            paidAmount: 0,
            remainingAmount: 0,
            totalInvoices: 0,
            paidInvoices: 0,
            unpaidInvoices: 0,
            paymentPercentage: 0,
            invoices: []
        };

        if (studentData) {
            const invoices = studentData.course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category || [];
            
            const totalAmount = parseFloat(studentData.payment) || 0;
            
            const paidAmount = invoices
                .filter(invoice => invoice.status === 'paid')
                .reduce((sum, invoice) => sum + parseFloat(invoice.amount || 0), 0);
            
            const remainingAmount = totalAmount - paidAmount;
            
            paymentStats = {
                totalAmount: totalAmount,
                paidAmount: paidAmount,
                remainingAmount: remainingAmount,
                totalInvoices: invoices.length,
                paidInvoices: invoices.filter(inv => inv.status === 'paid').length,
                unpaidInvoices: invoices.filter(inv => inv.status === 'open').length,
                cancelledInvoices: invoices.filter(inv => inv.status === 'cancelled').length,
                paymentPercentage: totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0,
                invoices: invoices.map(invoice => ({
                    id: invoice.id,
                    invoice_id: invoice.invoice_id,
                    number: invoice.number,
                    amount: parseFloat(invoice.amount || 0),
                    status: invoice.status,
                    description: invoice.description,
                    url: invoice.url,
                    due_date: invoice.due_date,
                    created_at: invoice.created_at,
                    updated_at: invoice.updated_at
                }))
            };
        }

        const exams = await prismaService.exam.findMany({
            where: {
                student: parseInt(id)
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
                category: parseInt(studentData?.category_course_student_category_categoryTocategory?.id)
            },
            select: {
                id: true,
                name: true,
                category: true,
                date: true
            }
        });

        // Оюутны сэдвүүдийн явцыг авах
        const studentTopicProgress = await prismaService.student_topic_progress.findMany({
            where: {
                student: parseInt(id)
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
        
        const now = new Date();

        // Оюутны бүх танхимийн хуваарийг дэлгэрэнгүй мэдээллийн хамт авах
        const schedules = await prismaService.course_student_schedule.findMany({
            where: {
                student: parseInt(id)
            },
            select: {
                id: true,
                student: true,
                schedule: true,
                attendance: true,
                note: true,
                date: true,
                updated_at: true,
                schedule_course_student_schedule_scheduleToschedule: {
                    select: {
                        id: true,
                        course: true,
                        category: true,
                        schedule_date: true,
                        start_time: true,
                        end_time: true,
                        location: true,
                        note: true,
                        date: true,
                        course_teachers: {
                            select: {
                                id: true,
                                firstname: true,
                                lastname: true
                            }
                        },
                        category_schedule_categoryTocategory: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        // Оюутны жолоодлогын хуваарийг дэлгэрэнгүй мэдээллийн хамт авах
        const drivingSchedules = await prismaService.course_student_driving_schedule.findMany({
            where: {
                student: parseInt(id)
            },
            select: {
                id: true,
                student: true,
                driving_schedule: true,
                attendance: true,
                note: true,
                date: true,
                update_date: true,
                driving_schedule_course_student_driving_schedule_driving_scheduleTodriving_schedule: {
                    select: {
                        id: true,
                        course: true,
                        category: true,
                        area: true,
                        schedule_date: true,
                        start_time: true,
                        end_time: true,
                        note: true,
                        add_date: true,
                        course_teachers: {
                            select: {
                                id: true,
                                firstname: true,
                                lastname: true
                            }
                        },
                        course_cars: {
                            select: {
                                id: true,
                                vechile: true,
                                region_number: true,
                                type: true
                            }
                        },
                        category_driving_schedule_categoryTocategory: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        // Schedule мэдээллийг map хийх helper функц
        const mapScheduleItem = (s) => ({
            id: s.id,
            attendance: s.attendance,
            note: s.note,
            date: s.date,
            updated_at: s.updated_at,
            scheduleInfo: s.schedule_course_student_schedule_scheduleToschedule
        });

        // Driving schedule мэдээллийг map хийх helper функц
        const mapDrivingScheduleItem = (s) => ({
            id: s.id,
            attendance: s.attendance,
            note: s.note,
            date: s.date,
            update_date: s.update_date,
            drivingScheduleInfo: s.driving_schedule_course_student_driving_schedule_driving_scheduleTodriving_schedule
        });



        // Эхлээгүй (upcoming) schedule шүүх helper — schedule_date нь одоогийн цагаас хойш байвал эхлээгүй
        const isScheduleNotStarted = (s) => {
            const sd = s.schedule_course_student_schedule_scheduleToschedule?.schedule_date;
            return sd && new Date(sd) > now;
        };

        const isDrivingNotStarted = (s) => {
            const sd = s.driving_schedule_course_student_driving_schedule_driving_scheduleTodriving_schedule?.schedule_date;
            return sd && new Date(sd) > now;
        };

        // Танхимийн хуваарийн статистик тооцоолох
        const scheduleStats = {
            total: schedules.length,
            notStarted: schedules.filter(isScheduleNotStarted).length,
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
            notStarted: drivingSchedules.filter(isDrivingNotStarted).length,
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
        const allExams = exams.map(exam => ({
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
                // Суралцагчийн үндсэн мэдээлэл
                studentData: student,
                
                // Төлбөрийн статистик ба нэхэмжлэлүүд
                paymentStats: {
                    totalAmount: paymentStats.totalAmount,
                    paidAmount: paymentStats.paidAmount,
                    remainingAmount: paymentStats.remainingAmount,
                    totalInvoices: paymentStats.totalInvoices,
                    paidInvoices: paymentStats.paidInvoices,
                    unpaidInvoices: paymentStats.unpaidInvoices,
                    cancelledInvoices: paymentStats.cancelledInvoices,
                    paymentPercentage: paymentStats.paymentPercentage
                },
                invoices: paymentStats.invoices,
                
                // Танхимийн хуваарийн статистик
                scheduleStats: {
                    total: scheduleStats.total,
                    notStarted: scheduleStats.notStarted,
                    notMarked: scheduleStats.notMarked,
                    attended: scheduleStats.attended,
                    notAttended: scheduleStats.notAttended,
                    attendanceRate: scheduleStats.attendanceRate,
                    scheduleProgress: scheduleStats.scheduleProgress
                },
                // Танхимийн хуваарийн дэлгэрэнгүй мэдээлэл
                scheduleDetails: {
                    allList: schedules.map(mapScheduleItem),
                    notStartedList: schedules.filter(isScheduleNotStarted).map(mapScheduleItem),
                    notMarkedList: schedules.filter(s => s.attendance === 0).map(mapScheduleItem),
                    attendedList: schedules.filter(s => s.attendance === 1).map(mapScheduleItem),
                    notAttendedList: schedules.filter(s => s.attendance === 2).map(mapScheduleItem)
                },
                
                // Жолоодлогын хуваарийн статистик
                drivingStats: {
                    total: drivingStats.total,
                    notStarted: drivingStats.notStarted,
                    notMarked: drivingStats.notMarked,
                    attended: drivingStats.attended,
                    notAttended: drivingStats.notAttended,
                    attendanceRate: drivingStats.attendanceRate,
                    scheduleProgress: drivingStats.scheduleProgress
                },
                // Жолоодлогын хуваарийн дэлгэрэнгүй мэдээлэл
                drivingDetails: {
                    allList: drivingSchedules.map(mapDrivingScheduleItem),
                    notStartedList: drivingSchedules.filter(isDrivingNotStarted).map(mapDrivingScheduleItem),
                    notMarkedList: drivingSchedules.filter(s => s.attendance === 0).map(mapDrivingScheduleItem),
                    attendedList: drivingSchedules.filter(s => s.attendance === 1).map(mapDrivingScheduleItem),
                    notAttendedList: drivingSchedules.filter(s => s.attendance === 2).map(mapDrivingScheduleItem)
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
                allExams: allExams
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

module.exports = COURSE_STUDENT_GET_STAT;