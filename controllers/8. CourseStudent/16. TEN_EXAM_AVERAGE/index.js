const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const ME_STUDENT_TEN_EXAM_AVERATE = async (req, res) => {
    try {
        const student = req.user;

        const exams = await prismaService.exam.findMany({
            where: {
                student: parseInt(student?.id)
            },
            orderBy: {
                date: 'desc'
            },
            take: 10,
            select: {
                id: true,
                progress: true,  
                success: true,    
                wrong: true,      
                isMake: true,   
                date: true,
                category_exam_categoryTocategory: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        const completedExams = exams.filter(e => e.isMake === 1);
        const count = completedExams.length;

        const avgProgress = count > 0
            ? completedExams.reduce((sum, e) => sum + (e.progress ?? 0), 0) / count
            : 0;

        const avgSuccess = count > 0
            ? completedExams.reduce((sum, e) => sum + (e.success ?? 0), 0) / count
            : 0;

        const avgWrong = count > 0
            ? completedExams.reduce((sum, e) => sum + (e.wrong ?? 0), 0) / count
            : 0;

        const totalSuccess = completedExams.reduce((sum, e) => sum + (e.success ?? 0), 0);
        const totalWrong   = completedExams.reduce((sum, e) => sum + (e.wrong ?? 0), 0);

        return res.status(200).json({
            success: true,
            data: {
                exams,                             
                summary: {
                    total: exams.length,            
                    completed: count,               
                    avgProgress: parseFloat(avgProgress.toFixed(2)),  
                    avgSuccess:  parseFloat(avgSuccess.toFixed(2)),  
                    avgWrong:    parseFloat(avgWrong.toFixed(2)),    
                    totalSuccess,  
                    totalWrong     
                }
            },
            message: 'Амжилттай.'
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = ME_STUDENT_TEN_EXAM_AVERATE;