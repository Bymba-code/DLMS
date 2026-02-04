const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const STUDENT_GET_ALL_TOPIC = async (req, res) => {
    try 
    {
        const student = req.user; 

        const {
            page,
            limit,
            search,
            orderBy = 'id',  // 'order' биш 'id' болгосон
            order = 'asc',
        } = req.query;

        // Суралцагчийн ангилалын мэдээлэл авах
        const studentData = await prismaService.course_student_category.findFirst({
            where: {
                student: parseInt(student.id)
            },
            include: {
                category_course_student_category_categoryTocategory: true
            }
        });

        if(!studentData) {
            return res.status(404).json({
                success: false,
                data: [],
                message: "Суралцагчийн ангилалын мэдээлэл олдсонгүй."
            });
        }

        // Бүх topic-уудыг авах
        const where = {
            category: parseInt(studentData.category_course_student_category_categoryTocategory?.id)
        };

        // Хайлтын нөхцөл
        if (search) {
            where.name = {
                contains: search
            };
        }

        const topics = await prismaService.topic.findMany({
            where,
            orderBy: {
                [orderBy]: order
            },
            skip: page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined,
            take: limit ? parseInt(limit) : undefined,
        });

        // Суралцагчийн прогрессийг авах
        const studentTopicProgress = await prismaService.student_topic_progress.findMany({
            where: {
                student: parseInt(student.id)
            },
            orderBy: {
                date: 'desc' // 'updatedAt' биш 'date' болгосон
            }
        });

        // Progress-ыг Map болгох - хамгийн өндөр progress-ыг хадгалах
        const progressMap = new Map();
        studentTopicProgress.forEach(progress => {
            const existingProgress = progressMap.get(progress.topic);
            // Хэрэв одоо байгаа progress-ээс өндөр бол солих
            if (!existingProgress || progress.progress > existingProgress.progress) {
                progressMap.set(progress.topic, {
                    id: progress.id,
                    progress: progress.progress || 0,
                    completed: progress.completed || false,
                    date: progress.date
                });
            }
        });

        // Сүүлд харсан 3 topic (completed биш, progress > 0)
        const recentlyViewedTopics = studentTopicProgress
            .filter(p => p.progress > 0 && !p.completed)
            .slice(0, 3)
            .map(p => p.topic);

        // Topic бүрт unlock/lock статус болон прогресс нэмэх
        const topicsWithProgress = await Promise.all(topics.map(async (topic, index) => {
            const progress = progressMap.get(topic.id);
            
            // Topic-н хамгийн өндөр progress-тэй row-г авах
            const highestProgress = await prismaService.student_topic_progress.findFirst({
                where: {
                    topic: topic.id,
                    student: parseInt(student.id)
                },
                orderBy: {
                    progress: 'desc' // Хамгийн өндөр progress эхэнд
                }
            });
            
            // Unlock/Lock логик
            let isUnlocked = false;
            
            if (index === 0) {
                isUnlocked = true;
            } else {
                const previousTopic = topics[index - 1];
                const previousProgress = progressMap.get(previousTopic.id);
                
                if (previousProgress && previousProgress.progress >= 90) {
                    isUnlocked = true;
                }
            }

            return {
                id: topic.id,
                name: topic.name,
                description: topic.description,
                category: topic.category,
                order: topic.order || index + 1,
                highestProgress: highestProgress, // Хамгийн өндөр progress
                // Progress мэдээлэл
                progress: progress ? {
                    id: progress.id,
                    progress: progress.progress,
                    completed: progress.completed,
                    date: progress.date
                } : {
                    id: null,
                    progress: 0,
                    completed: false,
                    date: null
                },
                // Lock/Unlock статус
                isUnlocked: isUnlocked,
                isLocked: !isUnlocked,
                // Сүүлд үзсэн эсэх
                isRecentlyViewed: recentlyViewedTopics.includes(topic.id)
            };
        }));

        // Нийт тоо гаргах
        const total = await prismaService.topic.count({ where });

        // Статистик тооцоолох
        const stats = {
            total: topicsWithProgress.length,
            unlocked: topicsWithProgress.filter(t => t.isUnlocked).length,
            completed: topicsWithProgress.filter(t => t.progress.completed).length,
            inProgress: topicsWithProgress.filter(t => t.progress.progress > 0 && !t.progress.completed).length,
            locked: topicsWithProgress.filter(t => t.isLocked).length
        };

        // Сүүлд харсан сэдвүүд (дэлгэрэнгүй мэдээлэлтэй)
        const recentTopics = topicsWithProgress
            .filter(t => t.isRecentlyViewed)
            .map(t => ({
                id: t.id,
                name: t.name,
                progress: t.progress.progress,
                date: t.progress.date
            }));

        return res.status(200).json({
            success: true,
            data: topicsWithProgress,
            stats: stats,
            recentlyViewed: recentTopics, // Сүүлд харсан сэдвүүд
            pagination: limit ? {
                total,
                page: parseInt(page) || 1,
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit)),
                hasNextPage: (parseInt(page) || 1) < Math.ceil(total / parseInt(limit)),
                hasPrevPage: (parseInt(page) || 1) > 1
            } : null,
            message: 'Амжилттай'
        });

    } 
    catch(err) 
    {
        console.error('STUDENT_GET_ALL_TOPIC error:', err);
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа: ' + err.message
        });
    }
};

module.exports = STUDENT_GET_ALL_TOPIC;